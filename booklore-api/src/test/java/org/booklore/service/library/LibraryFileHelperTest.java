package org.booklore.service.library;

import org.booklore.model.dto.settings.LibraryFile;
import org.booklore.model.entity.LibraryEntity;
import org.booklore.model.entity.LibraryPathEntity;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assumptions.assumeFalse;

@ExtendWith(MockitoExtension.class)
class LibraryFileHelperTest {
    @TempDir
    Path tempDir;

    @Test
    void testGetLibraryFiles_HandlesInaccessibleDirectories() throws IOException {
        LibraryFileHelper libraryFileHelper = new LibraryFileHelper();

        Files.createFile(tempDir.resolve("happy.epub"));
        Path inaccessibleDir = tempDir.resolve("some_other_random_named_dir");
        Files.createDirectory(inaccessibleDir);
        Files.createFile(tempDir.resolve("zzzz_happ.epub"));

        makeUnreadable(inaccessibleDir);

        try {
            assumeFalse(Files.isReadable(inaccessibleDir), "Cannot make directory unreadable on this platform");

            LibraryPathEntity libraryPath = new LibraryPathEntity();
            libraryPath.setId(10L);
            libraryPath.setPath(tempDir.toString());

            LibraryEntity testLibrary = LibraryEntity.builder()
                    .name("Test Library")
                    .icon("book")
                    .watch(false)
                    .libraryPaths(List.of(libraryPath))
                    .build();

            List<LibraryFile> libraryFiles = libraryFileHelper.getLibraryFiles(testLibrary);
            assertEquals(libraryFiles.stream().map(LibraryFile::getFileName).sorted().toList(), List.of("happy.epub", "zzzz_happ.epub"));
        } finally {
            restoreReadable(inaccessibleDir);
        }
    }

    private void makeUnreadable(Path dir) throws IOException {
        if (dir.getFileSystem().supportedFileAttributeViews().contains("posix")) {
            Files.setPosixFilePermissions(dir, PosixFilePermissions.fromString("---------"));
            return;
        }

        File directory = dir.toFile();
        directory.setReadable(false, false);
        directory.setExecutable(false, false);
    }

    private void restoreReadable(Path dir) throws IOException {
        if (!Files.exists(dir)) {
            return;
        }

        if (dir.getFileSystem().supportedFileAttributeViews().contains("posix")) {
            Files.setPosixFilePermissions(dir, PosixFilePermissions.fromString("rwx------"));
            return;
        }

        File directory = dir.toFile();
        directory.setReadable(true, false);
        directory.setWritable(true, false);
        directory.setExecutable(true, false);
    }
}
