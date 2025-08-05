import { Borrow } from "./borrow";

export interface DashboardData {
  totalBooks: number;
  totalUsers: number;
  totalReturned: number;
  recentBorrowHistory: Borrow[];
};