
# LIMS Testing API - Sample JSON Responses

This document contains sample JSON responses for all testing-related API endpoints in the LIMS system.

## 1. Get Testing Assignments

**Endpoint:** `GET /api/v1/assignments?teams={teamNames}`

**Sample Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "sampleCode": "LT-001",
      "sampleType": "Lithium Battery",
      "sampleSubType": "Cell",
      "sampleQuantity": 5,
      "testingRequirements": ["QCVN101:2020+IEC", "QCVN101:2020"],
      "receivedTime": "2024-01-15T09:00:00Z",
      "technicalDocumentation": [
        {
          "id": "1",
          "name": "Battery_Specification.pdf",
          "type": "pdf",
          "size": 1024000,
          "uploadedAt": "2024-01-15T08:00:00Z",
          "uploadedBy": "reception1",
          "url": "uploads/battery-spec.pdf"
        }
      ],
      "status": "Pending",
      "assignedTeam": "Battery Testing Team",
      "assignedBy": "manager1",
      "testSample": "Li-ion Cell Model ABC123",
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-15T09:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

## 2. Get Testing Criteria

**Endpoint:** `GET /api/v1/testing-criteria?sampleType={sampleType}&requirements={requirements}`

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "testingCriteria": [
      {
        "id": "requirement-1",
        "requirementName": "QCVN101:2020+IEC",
        "sectionTitle": "QCVN101:2020 with IEC 62133-2:2017 Battery Safety Requirements",
        "criteria": [
          {
            "id": "QCVN101:2020+IEC-continuous-charge",
            "name": "Continuous charge at constant voltage",
            "sectionNumber": "2.6.1.1/7.2.1",
            "tableStructure": {
              "columns": [
                {
                  "id": "model",
                  "header": "Model",
                  "type": "readonly"
                },
                {
                  "id": "voltage",
                  "header": "Recommended charging voltage Vcc (Vdc)",
                  "type": "number",
                  "unit": "V",
                  "placeholder": "Enter voltage",
                  "required": true,
                  "validation": {
                    "min": 0,
                    "max": 100
                  }
                },
                {
                  "id": "current",
                  "header": "Recommended charging current Irec (mA)",
                  "type": "number",
                  "unit": "mA",
                  "placeholder": "Enter current"
                },
                {
                  "id": "ocv",
                  "header": "OCV at start of test, (Vdc)",
                  "type": "number",
                  "unit": "V",
                  "placeholder": "Enter OCV"
                },
                {
                  "id": "results",
                  "header": "Results",
                  "type": "select",
                  "options": ["Pass", "Fail", "N/A"],
                  "default": "N/A"
                }
              ],
              "rowTemplate": {
                "modelPrefix": "C#",
                "modelCount": 5
              }
            },
            "tableData": {
              "rows": [
                {
                  "id": "row-1",
                  "model": "C#01",
                  "values": {
                    "voltage": "4.2",
                    "current": "500",
                    "ocv": "3.7",
                    "results": "Pass"
                  }
                }
              ]
            },
            "result": "Pass",
            "supplementaryInfo": {
              "defaultNotes": ["No fire, no explosion, no leakage"],
              "notes": ["No fire, no explosion, no leakage", "Test completed successfully"],
              "testingTime": "2024-01-15T10:30:00Z",
              "tester": "tester1",
              "equipment": "PSI.TB-001"
            }
          }
        ]
      }
    ]
  }
}
```

## 3. Get Additional Testing Criteria

**Endpoint:** `GET /api/v1/testing-requirements/additional-criteria?sampleType={sampleType}&requirements={requirements}`

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "additionalCriteria": [
      {
        "id": "requirement-2",
        "requirementName": "Custom Requirement",
        "sectionTitle": "Customer Specific Testing Requirements",
        "criteria": [
          {
            "id": "custom-temperature-test",
            "name": "Temperature cycling test",
            "sectionNumber": "C.1.1",
            "tableStructure": {
              "columns": [
                {
                  "id": "model",
                  "header": "Model",
                  "type": "readonly"
                },
                {
                  "id": "temp_min",
                  "header": "Min Temperature (°C)",
                  "type": "number",
                  "unit": "°C",
                  "placeholder": "Enter min temp"
                },
                {
                  "id": "temp_max",
                  "header": "Max Temperature (°C)",
                  "type": "number",
                  "unit": "°C",
                  "placeholder": "Enter max temp"
                },
                {
                  "id": "cycles",
                  "header": "Number of Cycles",
                  "type": "number",
                  "placeholder": "Enter cycle count"
                },
                {
                  "id": "results",
                  "header": "Results",
                  "type": "select",
                  "options": ["Pass", "Fail", "N/A"],
                  "default": "N/A"
                }
              ],
              "rowTemplate": {
                "modelPrefix": "T#",
                "modelCount": 3
              }
            },
            "result": null,
            "supplementaryInfo": {
              "defaultNotes": ["No physical damage", "No performance degradation"],
              "notes": [],
              "testingTime": "",
              "tester": "",
              "equipment": ""
            }
          }
        ]
      }
    ]
  }
}
```

## 4. Get Existing Inspection Log

**Endpoint:** `GET /api/v1/inspection-logs?assignmentId={assignmentId}`

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "id": "log-001",
    "assignmentId": "1",
    "sampleSymbol": "LT-001",
    "testingRequirements": ["QCVN101:2020+IEC", "QCVN101:2020"],
    "testSample": "Li-ion Cell Model ABC123",
    "testingDate": "2024-01-15",
    "sampleInfo": {
      "manufacturer": "ABC Battery Co.",
      "model": "ABC123",
      "specifications": "3.7V 2500mAh",
      "quantity": 5,
      "condition": "New",
      "packaging": "Individual cells in protective cases"
    },
    "testingCriteria": [],
    "requirementSections": [
      {
        "id": "requirement-1",
        "requirementName": "QCVN101:2020+IEC",
        "sectionTitle": "QCVN101:2020 with IEC 62133-2:2017 Battery Safety Requirements",
        "criteria": [
          {
            "id": "QCVN101:2020+IEC-continuous-charge",
            "name": "Continuous charge at constant voltage",
            "sectionNumber": "2.6.1.1/7.2.1",
            "tableData": {
              "rows": [
                {
                  "id": "row-1",
                  "model": "C#01",
                  "values": {
                    "voltage": "4.2",
                    "current": "500",
                    "ocv": "3.7",
                    "results": "Pass"
                  }
                }
              ]
            },
            "result": "Pass"
          }
        ]
      }
    ],
    "status": "Draft",
    "createdBy": "tester1",
    "createdAt": "2024-01-15T09:00:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

## 5. Update Assignment Status

**Endpoint:** `PUT /api/v1/assignments/{assignmentId}`

**Sample Request Body:**
```json
{
  "status": "In Progress",
  "updatedAt": "2024-01-15T14:30:00Z"
}
```

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "sampleCode": "LT-001",
    "sampleType": "Lithium Battery",
    "sampleSubType": "Cell",
    "sampleQuantity": 5,
    "testingRequirements": ["QCVN101:2020+IEC", "QCVN101:2020"],
    "receivedTime": "2024-01-15T09:00:00Z",
    "status": "In Progress",
    "assignedTeam": "Battery Testing Team",
    "assignedBy": "manager1",
    "testSample": "Li-ion Cell Model ABC123",
    "createdAt": "2024-01-15T09:00:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

## 6. Save/Update Inspection Log

**Endpoint:** `POST /api/v1/inspection-logs` (create) or `PUT /api/v1/inspection-logs/{logId}` (update)

**Sample Request Body:**
```json
{
  "assignmentId": "1",
  "sampleSymbol": "LT-001",
  "testingRequirements": ["QCVN101:2020+IEC"],
  "testSample": "Li-ion Cell Model ABC123",
  "testingDate": "2024-01-15",
  "sampleInfo": {
    "manufacturer": "ABC Battery Co.",
    "model": "ABC123",
    "specifications": "3.7V 2500mAh"
  },
  "requirementSections": [
    {
      "id": "requirement-1",
      "requirementName": "QCVN101:2020+IEC",
      "sectionTitle": "QCVN101:2020 with IEC 62133-2:2017 Battery Safety Requirements",
      "criteria": [
        {
          "id": "QCVN101:2020+IEC-continuous-charge",
          "tableData": {
            "rows": [
              {
                "id": "row-1",
                "model": "C#01",
                "values": {
                  "voltage": "4.2",
                  "current": "500",
                  "results": "Pass"
                }
              }
            ]
          }
        }
      ]
    }
  ],
  "status": "Draft"
}
```

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "id": "log-001",
    "assignmentId": "1",
    "sampleSymbol": "LT-001",
    "testingRequirements": ["QCVN101:2020+IEC"],
    "testSample": "Li-ion Cell Model ABC123",
    "testingDate": "2024-01-15",
    "sampleInfo": {
      "manufacturer": "ABC Battery Co.",
      "model": "ABC123",
      "specifications": "3.7V 2500mAh"
    },
    "requirementSections": [],
    "status": "Draft",
    "createdBy": "tester1",
    "createdAt": "2024-01-15T09:00:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

## 7. Update Table Data

**Endpoint:** `PUT /api/v1/testing-criteria/{requirementId}/criteria/{criterionId}/table-data`

**Sample Request Body:**
```json
{
  "rowId": "row-1",
  "columnId": "voltage",
  "value": "4.2"
}
```

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "updated": true,
    "criterion": {
      "id": "QCVN101:2020+IEC-continuous-charge",
      "tableData": {
        "rows": [
          {
            "id": "row-1",
            "model": "C#01",
            "values": {
              "voltage": "4.2",
              "current": "500",
              "ocv": "3.7",
              "results": "N/A"
            }
          }
        ]
      }
    }
  }
}
```

## Error Response Format

All API endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid sample type provided",
    "details": {
      "field": "sampleType",
      "allowedValues": ["Lithium Battery", "ITAV Adapter", "ITAV Desktop", "ITAV Laptop+Tablet", "ITAV TV"]
    }
  }
}
```
