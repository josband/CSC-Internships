import { apiSlice } from "../../app/api/apiSlice";

interface IJob {
    _id?: number;
    companyName: string;
    jobDescription: string;
    locations: string[];
    sponsorshipStatus: Boolean;
    jobStatus: Boolean;
    jobLink: string;
    contributor?: string;
}

export const jobApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getJobs: builder.query<IJob[], void>({
            query: () => ({
                url: "/jobs",
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: (result, error, arg) => {
				return [{ type: "Job", id: "LIST" }];
			},
        }),
        addNewJob: builder.mutation<IJob, IJob>({
            query: (jobData) => ({
                url: "/jobs",
                method: "POST",
                body: {
                    ...jobData,
                },
            }),
            invalidatesTags: [{ type: "Job", id: "LIST" }],
        }),
        updateJob: builder.mutation<IJob, IJob>({
            query: (jobData) => ({
                url: "/jobs",
                method: "PATCH",
                body: {
                    ...jobData,
                },
            }),
        }),
        deleteJob: builder.mutation<void, IJob>({
            query: ({ _id }) => ({
                url: "/users",
                method: "DELETE",
                body: { _id },
            }),
        }),
    }),
});

export const {
    useGetJobsQuery,
    useAddNewJobMutation,
    useUpdateJobMutation,
    useDeleteJobMutation,
} = jobApiSlice;


