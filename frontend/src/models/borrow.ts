export interface Borrow {
    id: number;
    userName: string;
    bookTitle: string;
    borrowedAt: string;
    returnedAt: string | null;
    status: 'Active' | 'Returned' | 'Late';
}
