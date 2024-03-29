export default interface IApiResponse<T> {
	success: boolean
	status: number | null
	data: T | null
	error?: any
	res?: any
}
