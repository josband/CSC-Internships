import { useAppSelector } from "../../app/hooks";
import { getFilters } from "./filterSlice";
import "../../styles/FilterList.component.css";
import Filter from "./Filter";

const FilterList = () => {
    // Get the list of filters from the store
    const filters = useAppSelector(getFilters);

    // Return a list of filters
    return (
        <div className="filter-list-container">
            <div className="filter-list-title">
                {filters.length > 0 && <h3>Filters:</h3>}
                {filters.length === 0 && <h3>No filters</h3>}
            </div>
            <>
                {filters.map((filter, i) => {
                    return <Filter key={i} filter={filter} />;
                })}
            </>
        </div>
    );
};

export default FilterList;