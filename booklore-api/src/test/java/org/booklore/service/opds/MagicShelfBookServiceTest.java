package org.booklore.service.opds;

import org.booklore.exception.APIException;
import org.booklore.mapper.BookMapper;
import org.booklore.mapper.custom.BookLoreUserTransformer;
import org.booklore.model.dto.GroupRule;
import org.booklore.model.entity.BookEntity;
import org.booklore.model.entity.BookLoreUserEntity;
import org.booklore.model.entity.MagicShelfEntity;
import org.booklore.model.entity.UserPermissionsEntity;
import org.booklore.repository.BookRepository;
import org.booklore.repository.MagicShelfRepository;
import org.booklore.repository.UserRepository;
import org.booklore.service.BookRuleEvaluatorService;
import org.booklore.service.restriction.ContentRestrictionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MagicShelfBookServiceTest {

    @Mock
    private MagicShelfRepository magicShelfRepository;
    @Mock
    private BookRepository bookRepository;
    @Mock
    private BookMapper bookMapper;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BookLoreUserTransformer bookLoreUserTransformer;
    @Mock
    private BookRuleEvaluatorService ruleEvaluatorService;
    @Mock
    private ContentRestrictionService contentRestrictionService;

    private ObjectMapper objectMapper;

    @InjectMocks
    private MagicShelfBookService service;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        service = new MagicShelfBookService(
                magicShelfRepository,
                bookRepository,
                bookMapper,
                userRepository,
                bookLoreUserTransformer,
                ruleEvaluatorService,
                contentRestrictionService,
                objectMapper
        );
    }

    @Test
    void getBookIdsByMagicShelfId_ownerWithoutOpdsPermission_isAllowed() {
        Long userId = 7L;
        Long shelfId = 11L;
        MagicShelfEntity shelf = MagicShelfEntity.builder()
                .id(shelfId)
                .userId(userId)
                .name("Owned Shelf")
                .filterJson(validGroupRuleJson())
                .isPublic(false)
                .build();

        BookLoreUserEntity userEntity = BookLoreUserEntity.builder()
                .id(userId)
                .permissions(UserPermissionsEntity.builder().permissionAdmin(false).permissionAccessOpds(false).build())
                .build();

        BookEntity bookEntity = BookEntity.builder().id(101L).build();

        when(magicShelfRepository.findById(shelfId)).thenReturn(Optional.of(shelf));
        when(userRepository.findById(userId)).thenReturn(Optional.of(userEntity));
        when(ruleEvaluatorService.toSpecification(any(GroupRule.class), eq(userId))).thenReturn((root, query, cb) -> null);
        when(bookRepository.findAll(any(Specification.class), eq(PageRequest.of(0, 5)))).thenReturn(new PageImpl<>(List.of(bookEntity), PageRequest.of(0, 5), 1));
        when(contentRestrictionService.applyRestrictions(List.of(bookEntity), userId)).thenReturn(List.of(bookEntity));

        List<Long> ids = service.getBookIdsByMagicShelfId(userId, shelfId, 5);

        assertEquals(List.of(101L), ids);
        verify(bookRepository).findAll(any(Specification.class), eq(PageRequest.of(0, 5)));
    }

    @Test
    void getBookIdsByMagicShelfId_privateShelfForDifferentUser_withoutAdmin_forbidden() {
        Long userId = 7L;
        Long shelfId = 11L;
        MagicShelfEntity shelf = MagicShelfEntity.builder()
                .id(shelfId)
                .userId(8L)
                .name("Private Shelf")
                .filterJson(validGroupRuleJson())
                .isPublic(false)
                .build();

        BookLoreUserEntity userEntity = BookLoreUserEntity.builder()
                .id(userId)
                .permissions(UserPermissionsEntity.builder().permissionAdmin(false).permissionAccessOpds(false).build())
                .build();

        when(magicShelfRepository.findById(shelfId)).thenReturn(Optional.of(shelf));
        when(userRepository.findById(userId)).thenReturn(Optional.of(userEntity));

        assertThrows(APIException.class, () -> service.getBookIdsByMagicShelfId(userId, shelfId, 5));
    }

    private String validGroupRuleJson() {
        return "{\"type\":\"group\",\"join\":\"and\",\"rules\":[]}";
    }
}
