/* eslint-disable @typescript-eslint/no-explicit-any */
import { Assignment } from '@/types/lims';
import { User } from '@/types/lims';
import { mapApiToAssignment } from '@/utils/assignmentMappers';

interface ApiResponse {
  status: string;
  data: {
    assignments: any[];
  };
}

export const fetchTesterAssignments = async (user: User): Promise<Assignment[]> => {
  console.log('User object:', user);
  
  if (!user) {
    console.warn('No user found');
    return [];
  }

  // Map team names from API response to team IDs
  const mapTeamNameToId = (teamName: string): string => {
    const teamMapping: Record<string, string> = {
      'Team A': '1',
      'Team B': '2', 
      'Team C': '3',
    };
    return teamMapping[teamName] || teamName;
  };

  // Get team IDs from user team and map them
  let teamIds: string[] = [];
  
  if (user?.team) {
    // Handle singular team field from API response
    teamIds = [mapTeamNameToId(user.team)];
  } else if (user?.teams && user.teams.length > 0) {
    // Handle legacy teams array if still present
    teamIds = user.teams.map(team => mapTeamNameToId(team));
  } else if (user?.role === 'TESTER') {
    // Default fallback for testers when team field is missing from API
    console.warn('No team field in user data, defaulting to Team 1 for tester');
    teamIds = ['1'];
  }

  if (teamIds.length === 0) {
    console.warn('User has no teams assigned');
    throw new Error('You are not assigned to any testing teams.');
  }

  console.log('Fetching assignments for teams:', teamIds);

  // Fetch assignments for each team
  const fetchPromises = teamIds.map(async (teamId) => {
    const response = await fetch(`/api/assignments/by-team/${teamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('limsToken')}`,
      },
    });

    console.log(`Team ${teamId} response status:`, response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: ApiResponse = await response.json();
    console.log(`Team ${teamId} data:`, data);
    
    return data;
  });

  const results = await Promise.all(fetchPromises);
  console.log('All API results:', results);

  // Process results with correct API response structure
  const allAssignments = results
    .flatMap(result => {
      console.log('Processing API result:', result);
      
      // Check new response structure: { status: "success", data: { assignments: [...] } }
      if (result.status === 'success' && result.data && Array.isArray(result.data.assignments)) {
        return result.data.assignments;
      }
      // Fallback for other structures
      else if (result.data.assignments && Array.isArray(result.data.assignments)) {
        return result.data.assignments;
      } else if (Array.isArray(result)) {
        return result;
      } else {
        console.warn('Unexpected response structure:', result);
        return [];
      }
    })
    .map(assignment => {
      try {
        console.log('Mapping assignment:', assignment);
        const mappedAssignment = mapApiToAssignment(assignment);
        console.log('Mapped assignment:', mappedAssignment);
        return mappedAssignment;
      } catch (error) {
        console.error('Failed to map assignment:', assignment, error);
        return null;
      }
    })
    .filter(assignment => assignment !== null) as Assignment[];

  console.log('Final processed assignments:', allAssignments);
  return allAssignments;
};

export const updateAssignmentStatus = async (updatedAssignment: Assignment): Promise<Assignment> => {
  const response = await fetch(`/api/v1/assignments/${updatedAssignment.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: updatedAssignment.status,
      updatedAt: updatedAssignment.updatedAt
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const apiResponse = await response.json();
  
  if (!apiResponse.success) {
    throw new Error(apiResponse.error?.message || 'Failed to update assignment');
  }

  return apiResponse.data;
};