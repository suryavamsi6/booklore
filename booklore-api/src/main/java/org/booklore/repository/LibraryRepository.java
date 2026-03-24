package org.booklore.repository;

import org.booklore.model.enums.IconType;
import org.booklore.model.entity.LibraryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryRepository extends JpaRepository<LibraryEntity, Long>, JpaSpecificationExecutor<LibraryEntity> {
    interface TelemetryLibraryStatisticsProjection {
        Long getLibraryId();
        Long getTotalLibraryPaths();
        Long getBookCount();
        boolean getWatchEnabled();
        IconType getIconType();
    }

    List<LibraryEntity> findByIdIn(List<Long> ids);

    @Query("""
            SELECT l.id AS libraryId,
                   COUNT(DISTINCT lp.id) AS totalLibraryPaths,
                   COUNT(DISTINCT b.id) AS bookCount,
                   l.watch AS watchEnabled,
                   l.iconType AS iconType
            FROM LibraryEntity l
            LEFT JOIN l.libraryPaths lp
            LEFT JOIN l.bookEntities b ON (b.deleted IS NULL OR b.deleted = false)
            GROUP BY l.id, l.watch, l.iconType
            ORDER BY l.id
            """)
    List<TelemetryLibraryStatisticsProjection> findTelemetryLibraryStatistics();
}
