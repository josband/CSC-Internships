import { useGetJobsQuery } from "../../features/jobs/jobApiSlice";
import "../../styles/jobPostingContainer.css";
import Job from "../../features/jobs/Job";
import { useState } from "react";
import UnpublishedJobsList from "./UnpublishedJobsList";

const AdminJobs = () => {
    const { data: jobs, isSuccess, error } = useGetJobsQuery();

    const [jobShownId, setJobShownId] = useState<string>("");

    // If it was successful, get the first job if it exists
    if (isSuccess) {
        const unpublishedJobs = jobs?.filter((job) => !job.published);
        return (
            <div className="job-posting-container">
                <div className="job-posting-container-object job-postings">
                    <UnpublishedJobsList setJobShownId={setJobShownId} />
                </div>
                <div className="job-posting-container-object">
                    <Job
                        jobs={unpublishedJobs}
                        key={jobShownId}
                        jobId={jobShownId ? jobShownId : unpublishedJobs[0] ? unpublishedJobs[0]._id! : ''}
                        setJobShownId={setJobShownId}
                    />
                </div>
            </div>
        );
    } else if (error) {
        if ("status" in error) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg =
                "error" in error ? error.error : JSON.stringify(error.data);

            return (
                <div>
                    <div>An error has occurred:</div>
                    <div>{errMsg}</div>
                </div>
            );
        } else {
            // you can access all properties of `SerializedError` here
            return <div>{error.message}</div>;
        }
    } else {
        return <h1>Loading...</h1>;
    }
};

export default AdminJobs;