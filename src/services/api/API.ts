import { IFetchAllMapsListResponse, IFetchMapResponse } from '@models/Maps'

import { AxiosResponse } from 'axios'
import axios from './axios'

import Key from '@models/Key'

enum AxiosMethodsEnum {
	GET = 'GET',
	POST = 'POST',
}

abstract class Api {
	/**
	 * @desc Запрос на получение всех дисциплин и факультетов
	 * @return {Promise<IFetchAllMapsListResponse[] | null>}
	 */
	static fetchAllMapsList() {
		return this.callFetch<IFetchAllMapsListResponse[]>('getAllMaps')
	}

	/**
	 * @desc Запрос на получение карты (таблицы)
	 * @param {Key} aupCode - Код карты
	 * @return {Promise<IFetchMapResponse | null>}
	 */
	static fetchMap(aupCode: Key) {
		return this.callFetch<IFetchMapResponse>(`map/${aupCode}`)
	}

	/**
	 * @desc Получение всех групп
	 * @return {Promise<ResponseFetchMap | null>}
	 */
	static fetchAllGroups() {
		return this.callFetch<any>(`getGroups`)
	}

	/**
	 * @desc Сохранение карты
	 * @param {Key} aupCode - Номер карты
	 * @param {any[]} table - Объект данных с картой
	 * @return {Promise<any | null>}
	 */
	static saveMap(aupCode: Key, table: any[]) {
		return this.callFetch<any>(`save/${aupCode}`, AxiosMethodsEnum.POST, table)
	}

	/**
	 * @desc Добавление группы
	 * @param {any} group - Группа
	 * @return {Promise<any | null>}
	 */
	static addGroup(group: any) {
		return this.callFetch<any>(`add-group`, AxiosMethodsEnum.POST, group)
	}

	/**
	 * @desc Удаление группы
	 * @param {Key} id - ID удаляемой группы
	 * @return {Promise<any | null>}
	 */
	static deleteGroup(id: Key) {
		return this.callFetch<any>(`delete-group`, AxiosMethodsEnum.POST, id)
	}

	/**
	 * @desc Обновление группы
	 * @param {any} group - Группа
	 * @return {Promise<any | null>}
	 */
	static updateGroup(group: any) {
		return this.callFetch<any>(`update-group`, AxiosMethodsEnum.POST, group)
	}

	/**
	 * @desc Приватный общий метод для вызова запросов axios
	 * @param {string} endpoint - Название энпдоинта на который отправляется запрос
	 * @param {AxiosMethodsEnum = AxiosMethodsEnum.GET} method - Метод для вызова в axios
	 * @param {any} args - Тело запроса
	 * @return {Promise<T | undefined>} Промис
	 */
	private static async callFetch<T = any>(
		endpoint: string,
		method: AxiosMethodsEnum = AxiosMethodsEnum.GET,
		args?: any
	): Promise<T | null> {
		try {
			const res: AxiosResponse<T> = await axios(endpoint, {
				method,
				data: args,
			})

			const data = res.data

			return data
		} catch (e) {
			console.log(e)
			return null
		}
	}
}

export default Api