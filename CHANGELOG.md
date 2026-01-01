# Release v1.0.0

## Summary

This PR introduces major features and improvements to the Cryptid-API, including new endpoints for images and classifications, enhanced domain architecture, improved error handling, and comprehensive documentation updates.

## Key Features

### Images Endpoints
- New endpoint to list all images from all cryptids with pagination
- New endpoint to get images by specific cryptid ID
- Enhanced image entity with additional metadata fields
- Comprehensive documentation in docs/IMAGES.md

### Classifications Endpoint
- New endpoint to list all classifications with optional category type filtering
- Support for three category types: Physical, Narrative, and Abstract
- Sortable and paginated results
- Detailed documentation in docs/CLASSIFICATIONS.md

### Domain Refactoring
- Migrated from numeric serial IDs to UUIDv7 for better scalability
- Removed Realm and Habitat entities to simplify domain model
- Enhanced domain rules and entity relationships
- Updated cryptid entity with cleaner structure

### Field Selection Parameter
- New fields parameter for all endpoints to customize response payloads
- Reduces bandwidth by requesting only needed fields
- Support for public and private field distinction
- Comprehensive tests for field selection feature

## Breaking Changes

**WARNING:** These changes may affect existing API consumers:

- **ID Format**: Changed from numeric to UUIDv7 format
- **Removed Filters**: realm, habitat, threatLevelMin, and threatLevelMax parameters removed
- **Removed Entities**: Realm and Habitat no longer exist in the domain
- **Response Shape**: Cryptid responses no longer include realm and habitat fields

## Improvements

### Error Handling
- Standardized error responses across all endpoints
- Robust error handler with consistent error codes
- Better validation error messages

### Documentation
- New comprehensive guides for Classifications and Images endpoints
- Updated all existing documentation to reflect changes
- Enhanced examples and use cases

### Infrastructure
- Added Railway deployment configuration
- SSL configuration improvements
- Enhanced database schema management

### Testing
- New test suite for field selection parameter
- Enhanced image endpoint tests (270 new test cases)
- Improved test coverage across the application

## Technical Changes

- **Database**: New migration structure with cleaner schema definitions
- **DTOs**: Updated DTOs to support field selection and new domain model
- **Mappers**: Enhanced mappers for flexible field mapping
- **Repositories**: Updated repository implementations for new domain structure
- **Dependency Injection**: Added new service registrations in container

## Files Changed

72 files changed, 2,248 insertions(+), 1,324 deletions(-)

## Migration Guide

For API consumers upgrading from previous versions:

1. **Update ID handling**: Change from numeric to UUID format
2. **Remove deprecated filters**: Stop using realm, habitat, threatLevelMin, threatLevelMax
3. **Update response parsing**: Remove references to realm and habitat fields
4. **Use new endpoints**: Leverage new /images and /classifications endpoints

## Test Plan

- All unit tests passing
- All integration tests passing
- Field selection tests passing
- Filter combination tests passing

---

Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
