
# LIMS Testing API - Field Specifications & Usage Guide

This document provides detailed field specifications, data types, and usage instructions for all testing-related API endpoints.

## 1. Get Testing Assignments

**Endpoint:** `GET /api/v1/assignments?teams={teamNames}`

### Query Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| teams | string | Yes | Comma-separated list of team names to filter assignments |

### Response Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| success | boolean | Yes | API call success status |
| data | Assignment[] | Yes | Array of assignment objects |
| total | number | Yes | Total number of assignments |
| page | number | Yes | Current page number |
| limit | number | Yes | Number of items per page |

### Assignment Object Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique assignment identifier |
| sampleCode | string | Yes | Unique sample code (e.g., "LT-001") |
| sampleType | enum | Yes | One of: "Lithium Battery", "ITAV Adapter", "ITAV Desktop", "ITAV Laptop+Tablet", "ITAV TV" |
| sampleSubType | enum | No | For batteries: "Cell", "Pack", "Cell+Pack" |
| sampleQuantity | number | Yes | Number of samples to test |
| testingRequirements | string[] | Yes | Array of testing requirement names |
| receivedTime | string | Yes | ISO 8601 datetime when sample was received |
| technicalDocumentation | TechnicalDocument[] | No | Array of uploaded documents |
| status | enum | Yes | One of: "Pending", "In Progress", "Done" |
| assignedTeam | string | Yes | Team name assigned to this test |
| assignedBy | string | Yes | User ID who assigned the test |
| testSample | string | Yes | Model name or description |
| createdAt | string | Yes | ISO 8601 creation datetime |
| updatedAt | string | Yes | ISO 8601 last update datetime |

### Usage in Codebase
```typescript
// In TesterDashboard.tsx
const fetchAssignments = async () => {
  const userTeams = user?.teams?.join(',') || '';
  const response = await fetch(`/api/v1/assignments?teams=${userTeams}`);
  const result = await response.json();
  setAssignments(result.data);
};
```

---

## 2. Get Testing Criteria

**Endpoint:** `GET /api/v1/testing-criteria?sampleType={sampleType}&requirements={requirements}`

### Query Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sampleType | enum | Yes | One of the valid sample types |
| requirements | string | Yes | Comma-separated list of testing requirements |

### Response Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| success | boolean | Yes | API call success status |
| data.testingCriteria | TestingRequirementSection[] | Yes | Array of requirement sections |

### TestingRequirementSection Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique requirement section identifier |
| requirementName | string | Yes | Name of the testing requirement |
| sectionTitle | string | Yes | Human-readable title for the section |
| criteria | TestingCriterion[] | Yes | Array of testing criteria |

### TestingCriterion Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique criterion identifier |
| name | string | Yes | Display name of the test criterion |
| sectionNumber | string | Yes | Section reference number (e.g., "2.6.1.1/7.2.1") |
| parentId | string | No | Parent criterion ID for hierarchical structure |
| tableStructure | TableStructure | Yes | Defines the table layout |
| tableData | TableData | No | Actual test data (populated during testing) |
| result | enum | No | Overall result: "Pass", "Fail", "N/A", or null |
| children | TestingCriterion[] | No | Sub-criteria for hierarchical tests |
| supplementaryInfo | SupplementaryInfo | No | Additional test information |

### TableStructure Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| columns | TableColumnDefinition[] | Yes | Array of column definitions |
| rowTemplate | RowTemplate | Yes | Template for generating rows |

### TableColumnDefinition Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique column identifier |
| header | string | Yes | Column header text |
| type | enum | Yes | One of: "text", "number", "select", "readonly", "date", "textarea" |
| unit | string | No | Unit of measurement (e.g., "V", "mA") |
| placeholder | string | No | Input placeholder text |
| options | string[] | No | Options for select type columns |
| default | string | No | Default value |
| width | string | No | CSS width value |
| required | boolean | No | Whether field is required |
| validation | ValidationRules | No | Validation constraints |

### ValidationRules Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| min | number | No | Minimum numeric value |
| max | number | No | Maximum numeric value |
| pattern | string | No | RegEx pattern for validation |

### Usage in Codebase
```typescript
// In StandardsDataManager.tsx
const loadRequirementsData = async () => {
  const response = await fetch(
    `/api/v1/testing-criteria?sampleType=${assignment.sampleType}&requirements=${assignment.testingRequirements.join(',')}`
  );
  const result = await response.json();
  setRequirementSections(result.data.testingCriteria);
};
```

---

## 3. Get Additional Testing Criteria

**Endpoint:** `GET /api/v1/testing-requirements/additional-criteria?sampleType={sampleType}&requirements={requirements}`

### Query Parameters
Same as Get Testing Criteria endpoint.

### Response Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| success | boolean | Yes | API call success status |
| data.additionalCriteria | TestingRequirementSection[] | Yes | Array of additional requirement sections |

### Usage in Codebase
```typescript
// In InspectionActions.tsx
const handleUpdateCriteria = async () => {
  const response = await fetch(
    `/api/v1/testing-requirements/additional-criteria?sampleType=${assignment.sampleType}&requirements=${assignment.testingRequirements.join(',')}`
  );
  const result = await response.json();
  setRequirementSections(prev => [...prev, ...result.data.additionalCriteria]);
};
```

---

## 4. Get Existing Inspection Log

**Endpoint:** `GET /api/v1/inspection-logs?assignmentId={assignmentId}`

### Query Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| assignmentId | string | Yes | Assignment ID to get inspection log for |

### Response Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| success | boolean | Yes | API call success status |
| data | InspectionLog | Yes | Inspection log object (if exists) |

### InspectionLog Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique inspection log identifier |
| assignmentId | string | Yes | Related assignment ID |
| sampleSymbol | string | Yes | Sample code/symbol |
| testingRequirements | string[] | Yes | Array of testing requirement names |
| testSample | string | Yes | Sample model/description |
| testingDate | string | Yes | Date in YYYY-MM-DD format |
| sampleInfo | Record<string, any> | Yes | Dynamic sample information object |
| testingCriteria | TestingCriterion[] | Yes | Legacy field (use requirementSections) |
| requirementSections | TestingRequirementSection[] | Yes | Current testing criteria structure |
| status | enum | Yes | One of: "Draft", "Completed" |
| createdBy | string | Yes | User ID who created the log |
| createdAt | string | Yes | ISO 8601 creation datetime |
| updatedAt | string | Yes | ISO 8601 last update datetime |

### Usage in Codebase
```typescript
// In InspectionLogManager.tsx
const loadExistingLog = async () => {
  const response = await fetch(`/api/v1/inspection-logs?assignmentId=${assignment.id}`);
  if (response.ok) {
    const result = await response.json();
    setInspectionLog(result.data);
  }
};
```

---

## 5. Update Assignment Status

**Endpoint:** `PUT /api/v1/assignments/{assignmentId}`

### URL Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| assignmentId | string | Yes | Assignment ID to update |

### Request Body Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | enum | No | New status: "Pending", "In Progress", "Done" |
| updatedAt | string | No | ISO 8601 update timestamp |

### Response Fields
Returns the updated Assignment object with same structure as Get Testing Assignments.

### Usage in Codebase
```typescript
// In TesterDashboard.tsx
const handleUpdateAssignment = async (updatedAssignment: Assignment) => {
  await fetch(`/api/v1/assignments/${updatedAssignment.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAssignment)
  });
};
```

---

## 6. Save/Update Inspection Log

**Endpoint:** `POST /api/v1/inspection-logs` (create) or `PUT /api/v1/inspection-logs/{logId}` (update)

### Request Body Fields
Uses the same InspectionLog structure as described in the Get Existing Inspection Log section.

### Response Fields
Returns the saved InspectionLog object.

### Usage in Codebase
```typescript
// In InspectionActions.tsx
const handleSaveInspectionLog = async () => {
  const method = inspectionLog.id ? 'PUT' : 'POST';
  const url = inspectionLog.id 
    ? `/api/v1/inspection-logs/${inspectionLog.id}`
    : '/api/v1/inspection-logs';
    
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedLog)
  });
  const result = await response.json();
  onUpdateInspectionLog(result.data);
};
```

---

## 7. Update Table Data

**Endpoint:** `PUT /api/v1/testing-criteria/{requirementId}/criteria/{criterionId}/table-data`

### URL Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| requirementId | string | Yes | Testing requirement section ID |
| criterionId | string | Yes | Testing criterion ID |

### Request Body Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| rowId | string | Yes | Table row identifier |
| columnId | string | Yes | Table column identifier |
| value | string | Yes | New value to set |

### Response Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| success | boolean | Yes | Update success status |
| data.updated | boolean | Yes | Whether data was updated |
| data.criterion | TestingCriterion | Yes | Updated criterion object |

### Usage in Codebase
```typescript
// In TestingCriteriaSection.tsx
const updateTableData = async (requirementId: string, criterionId: string, rowId: string, columnId: string, value: string) => {
  await fetch(`/api/v1/testing-criteria/${requirementId}/criteria/${criterionId}/table-data`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rowId, columnId, value })
  });
};
```

---

## Error Handling

All endpoints return errors in a consistent format:

### Error Response Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| success | boolean | Yes | Always false for errors |
| error.code | string | Yes | Error code (e.g., "VALIDATION_ERROR") |
| error.message | string | Yes | Human-readable error message |
| error.details | object | No | Additional error context |

### Common Error Codes
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `INTERNAL_ERROR`: Server-side error

### Usage in Codebase
```typescript
const handleApiCall = async () => {
  try {
    const response = await fetch('/api/v1/endpoint');
    const result = await response.json();
    
    if (!result.success) {
      console.error('API Error:', result.error);
      toast({
        title: "Error",
        description: result.error.message,
        variant: "destructive"
      });
      return;
    }
    
    // Handle successful response
    handleSuccess(result.data);
  } catch (error) {
    console.error('Network error:', error);
    toast({
      title: "Network Error",
      description: "Failed to connect to server"
    });
  }
};
```

## Integration Notes

1. **Authentication**: All endpoints require valid authentication headers
2. **Content-Type**: Always use `application/json` for request bodies
3. **Error Handling**: Always check the `success` field before processing data
4. **Timestamps**: All datetime fields use ISO 8601 format
5. **Validation**: Client-side validation should match server-side rules
6. **Caching**: Consider caching testing criteria data as it changes infrequently
7. **Real-time Updates**: Use WebSocket connections for real-time table data updates in collaborative environments
