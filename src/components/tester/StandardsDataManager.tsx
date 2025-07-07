/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import {
  Assignment,
  TestingRequirementSection,
  TestingCriterion,
  TableData,
  TableRowData,
  TableColumnDefinition,
} from "@/types/lims";

interface UseRequirementsDataReturn {
  requirementSections: TestingRequirementSection[];
  setRequirementSections: (sections: TestingRequirementSection[]) => void;
  loadRequirementsData: () => Promise<void>;
}

export const useRequirementsData = (
  assignment: Assignment
): UseRequirementsDataReturn => {
  const [requirementSections, setRequirementSections] = useState<
    TestingRequirementSection[]
  >([]);

  // Helper function to map sampleType to productTypeId
  const getProductTypeId = (sampleType: string): number => {
    const mapping: Record<string, number> = {
      "Lithium Battery": 1,
      "ITAV Adapter": 2,
      "ITAV Desktop": 3,
      "ITAV Laptop+Tablet": 4,
      "ITAV TV": 5,
    };
    return mapping[sampleType] || 1;
  };

  // Helper function to map testingRequirement to requirementId
  const getRequirementId = (requirement: string): number => {
    const mapping: Record<string, number> = {
      "QCVN101:2020": 1,
      "QCVN101:2020+IEC": 2,
      IEC62133: 3,
    };
    return mapping[requirement] || 1;
  };

  const loadRequirementsData = async () => {
    try {
      console.log("Loading requirements data for assignment:", assignment);

      // Gọi API thật để lấy testing criteria templates
      const productTypeId = getProductTypeId(assignment.sampleType);
      const requirementIds = assignment.testingRequirements.map((req) =>
        getRequirementId(req)
      );

      console.log("API params:", {
        productTypeId,
        requirementIds,
        sampleType: assignment.sampleType,
      });

      // Fetch data cho từng requirement
      const fetchPromises = requirementIds.map(async (requirementId) => {
        const url = `/api/templates/by-product-type-and-requirement?productTypeId=${productTypeId}&requirementId=${requirementId}`;
        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("limsToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiResponse = await response.json();
        console.log(
          "API response for requirement",
          requirementId,
          ":",
          apiResponse
        );

        return { requirementId, apiResponse };
      });

      const results = await Promise.all(fetchPromises);

      // Process all results
      const allSections: TestingRequirementSection[] = [];

      results.forEach(({ requirementId, apiResponse }) => {
        if (apiResponse.status === "success" && apiResponse.data.templates) {
          apiResponse.data.templates.forEach((template: any) => {
            const section: TestingRequirementSection = {
              id: `${requirementId}-${template.id}`,
              requirementName: template.name || template.code,
              sectionTitle: template.description || template.name,
              criteria:
                template.sections
                  ?.map((section: any) => {
                    console.log(
                      "Processing section:",
                      section.name,
                      "with rows:",
                      section.rows
                    );

                    // Sắp xếp rows theo orderIndex để đảm bảo thứ tự đúng
                    const sortedRows = [...(section.rows || [])].sort(
                      (a, b) => a.orderIndex - b.orderIndex
                    );

                    if (sortedRows.length === 0) {
                      return null;
                    }

                    // Row đầu tiên (orderIndex = 1) là header row
                    const headerRow = sortedRows[0];

                    // Các row còn lại là data rows
                    const dataRows = sortedRows.slice(1);

                    // Tạo columns từ header row
                    const columns: TableColumnDefinition[] =
                      headerRow.values?.map((headerValue: any) => ({
                        id: headerValue.collumnId.toString(),
                        header: headerValue.value,
                        type:
                          headerValue.value === "Model"
                            ? ("readonly" as const)
                            : ("text" as const),
                        width:
                          headerValue.value === "Model" ? "120px" : "150px",
                      })) || [];

                    // Tạo table data từ data rows
                    const tableRows: TableRowData[] = dataRows.map(
                      (dataRow: any) => {
                        const rowValues: Record<string, string> = {};
                        let model = "";

                        // Duyệt qua tất cả values trong row
                        dataRow.values?.forEach((value: any) => {
                          const columnId = value.collumnId.toString();
                          rowValues[columnId] = value.value;

                          // Tìm column có header là 'Model' để lấy model value
                          const modelColumn = columns.find(
                            (col) =>
                              col.id === columnId && col.header === "Model"
                          );
                          if (modelColumn) {
                            model = value.value;
                          }
                        });

                        return {
                          id: `${section.id}-${dataRow.id}`,
                          model: model,
                          values: rowValues,
                        };
                      }
                    );

                    console.log(
                      "Generated columns for section",
                      section.name,
                      ":",
                      columns
                    );
                    console.log(
                      "Generated table rows for section",
                      section.name,
                      ":",
                      tableRows
                    );

                    return {
                      id: section.id.toString(),
                      name: section.name,
                      sectionNumber: `${section.level}.${
                        section.orderIndex
                      }.1/${section.level + 1}.${section.orderIndex}.1`,
                      result:
                        section.passed === true
                          ? ("Pass" as const)
                          : section.passed === false
                          ? ("Fail" as const)
                          : null,
                      tableStructure: {
                        columns: columns,
                        rowTemplate: {
                          modelPrefix: "C#",
                          modelCount: dataRows.length || 1,
                        },
                      },
                      tableData: {
                        rows: tableRows,
                      },
                      supplementaryInfo: {
                        notes: ["No fire, no explosion, no leakage"],
                        defaultNotes: [],
                        testingTime: "",
                        tester: "",
                        equipment: "PSI.TB-",
                      },
                    };
                  })
                  .filter(Boolean) || [], // Filter out null values
            };
            allSections.push(section);
          });
        }
      });

      console.log("Final processed sections:", allSections);
      setRequirementSections(allSections);
    } catch (error) {
      console.error("Failed to load testing criteria:", error);
      setRequirementSections([]);
    }
  };

  useEffect(() => {
    loadRequirementsData();
  }, [assignment]);

  return {
    requirementSections,
    setRequirementSections,
    loadRequirementsData,
  };
};
