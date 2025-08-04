import { Search } from "lucide-react";
import React from "react";

type SearchInputProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  onKeyUp,
}: SearchInputProps) {
  return (
    <div className="relative w-full flex gap-2">
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
        className="flex-grow p-2 pl-10 border border-[#dee0e5] text-[#10151a] placeholder:text-[#5C738A] bg-[#ebedf2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <Search
        size={20}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}