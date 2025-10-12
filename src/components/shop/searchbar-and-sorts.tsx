"use client";

import { ReactNode, useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { debounce } from "lodash";

interface SearchbarAndSortsProps {
  searchValue: string;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSearchChange: (search: string) => void;
  onSortChange: (sortField: string, sortDirection: "asc" | "desc") => void;
}

export function SearchbarAndSorts({
  searchValue,
  sortField,
  sortDirection,
  onSearchChange,
  onSortChange,
}: SearchbarAndSortsProps): ReactNode {
  const [localSearch, setLocalSearch] = useState(searchValue);

  // Create a stable debounced function using useRef
  const debouncedSearchRef = useRef(
    debounce((value: string) => {
      onSearchChange(value);
    }, 500)
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, []);

  // Sync localSearch with searchValue when it changes externally (e.g., filter reset)
  // Only respond to searchValue changes, not localSearch changes
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const handleSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const newValue = event.target.value;
      setLocalSearch(newValue);
      debouncedSearchRef.current(newValue);
    },
    []
  );

  const handleSortChange = (value: string): void => {
    const [field, direction] = value.split("-");
    onSortChange(field, direction as "asc" | "desc");
  };

  const currentSortValue = `${sortField}-${sortDirection}`;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 dark:text-neutral-400" />
        <Input
          type="search"
          placeholder="Search products..."
          value={localSearch}
          onChange={handleSearchInputChange}
          className="pl-10 h-10"
          aria-label="Search products"
        />
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
          Sort by:
        </span>
        <Select value={currentSortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select sort option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Name: A to Z</SelectItem>
            <SelectItem value="title-desc">Name: Z to A</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
