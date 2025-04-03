// This file is a compatibility layer for migrating from Supabase to MySQL
// It provides a similar interface to Supabase but uses our MySQL client behind the scenes
import { mysqlClient } from '../mysql/client';

// Create a compatibility interface to make migration easier
export const supabase = {
  from: (table: string) => {
    return {
      // SELECT operations
      select: (columns: string = '*') => {
        // Columns param is ignored in our implementation
        return {
          // Filter by equality
          eq: (column: string, value: any) => {
            return {
              // Execute the query
              then: async (callback: (result: any) => void) => {
                try {
                  let data;
                  let error = null;
                  
                  switch(table) {
                    case 'students':
                      data = await mysqlClient.students.getAll();
                      // Filter results if eq was used
                      if (column && value) {
                        data = data.filter((item: any) => item[column] === value);
                      }
                      break;
                    case 'subjects':
                      data = await mysqlClient.subjects.getAll();
                      if (column && value) {
                        data = data.filter((item: any) => item[column] === value);
                      }
                      break;
                    case 'grades':
                      if (column === 'student_id') {
                        data = await mysqlClient.grades.getByStudent(value);
                      } else {
                        data = [];
                      }
                      break;
                    case 'feedback':
                      if (column === 'student_id') {
                        data = await mysqlClient.feedback.getByStudent(value);
                      } else {
                        data = [];
                      }
                      break;
                    case 'profiles':
                      data = await mysqlClient.users.getAll();
                      if (column && value) {
                        data = data.filter((item: any) => item[column] === value);
                      }
                      break;
                    default:
                      data = [];
                  }
                  
                  callback({ data, error });
                } catch (err) {
                  console.error(`Error in Supabase compatibility layer: ${err}`);
                  callback({ data: [], error: err });
                }
              },
              // Count records
              count: async () => {
                try {
                  let count = 0;
                  let error = null;
                  
                  switch(table) {
                    case 'students':
                      const students = await mysqlClient.students.getAll();
                      count = students.length;
                      break;
                    case 'subjects':
                      const subjects = await mysqlClient.subjects.getAll();
                      count = subjects.length;
                      break;
                    case 'profiles':
                      const users = await mysqlClient.users.getAll();
                      // Filter if eq was used
                      if (column && value) {
                        count = users.filter((user: any) => user[column] === value).length;
                      } else {
                        count = users.length;
                      }
                      break;
                    default:
                      count = 0;
                  }
                  
                  return { count, error };
                } catch (err) {
                  console.error(`Error in Supabase compatibility layer: ${err}`);
                  return { count: 0, error: err };
                }
              }
            };
          },
          // Dummy implementation for compatibility
          single: () => {
            return {
              then: async (callback: (result: any) => void) => {
                try {
                  let data = null;
                  let error = null;
                  
                  switch(table) {
                    case 'students':
                      const students = await mysqlClient.students.getAll();
                      data = students.length > 0 ? students[0] : null;
                      break;
                    case 'subjects':
                      const subjects = await mysqlClient.subjects.getAll();
                      data = subjects.length > 0 ? subjects[0] : null;
                      break;
                    default:
                      data = null;
                  }
                  
                  callback({ data, error });
                } catch (err) {
                  callback({ data: null, error: err });
                }
              }
            };
          }
        };
      },
      // INSERT operations
      insert: (values: any) => {
        return {
          select: () => {
            return {
              then: async (callback: (result: any) => void) => {
                try {
                  let data;
                  let error = null;
                  
                  switch(table) {
                    case 'students':
                      data = await mysqlClient.students.create(values[0]);
                      break;
                    case 'subjects':
                      data = await mysqlClient.subjects.create(values[0]);
                      break;
                    case 'grades':
                      data = await mysqlClient.grades.create(values[0]);
                      break;
                    case 'feedback':
                      data = await mysqlClient.feedback.create(values[0]);
                      break;
                    default:
                      data = null;
                      error = new Error('Table not supported');
                  }
                  
                  callback({ data: [data], error });
                } catch (err) {
                  callback({ data: null, error: err });
                }
              }
            };
          }
        };
      }
    };
  },
  // Dummy auth implementation for compatibility
  auth: {
    // These are no-op methods since we've already migrated the auth system
    onAuthStateChange: () => {
      console.warn('Using auth compatibility layer - auth has been migrated to JWT');
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    getSession: async () => {
      console.warn('Using auth compatibility layer - auth has been migrated to JWT');
      return { data: { session: null } };
    },
    signOut: async () => {
      console.warn('Using auth compatibility layer - auth has been migrated to JWT');
      return { error: null };
    }
  }
};