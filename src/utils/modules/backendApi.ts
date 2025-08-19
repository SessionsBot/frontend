// Imported TypeScript:
// import { GuildDataResponse, SecureActionResponse, SecureActionNames } 
import type { APIResponse, GuildDataResponse, SessionSchedule } from "@sessionsbot/api-types";
import axios, { AxiosResponse } from "axios";
import { useAuthStore } from "../stores/auth";



/** Fetches guild data from backend API.
 * @details
 * + Discord ➞ Guild API Data
 * + Discord ➞ Channels API Data
 * + Firestore ➞ Internal Guild Data
 * + and more...
 * @param guildId Discord Guild ID to fetch data for
 */
export async function getGuildData(guildId:string) : Promise <GuildDataResponse> {
    const requestUrl = 'https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/v2/guilds/' + guildId;

    let responseData : GuildDataResponse;

    try {
        const guildFetchAttempt = await axios.get(requestUrl)

        if(!guildFetchAttempt?.data?.data) throw 'Could not fetch/find guild data, please try again!';
        else responseData = guildFetchAttempt?.data
        
        return responseData;
        
    } catch (error) {
        
        console.warn('API ERROR', 'Fetch Guild Data', error);
        if(error?.response?.data) return error?.response?.data // Return response error data if possible
        else responseData = {
                success: false,
                data: null,
                error
            };
        return responseData;
    }
}


/** Updates guild schedule by id using backend API. */
export async function updateSessionSchedule(guildId:string, scheduleId:string, scheduleData:SessionSchedule) {
    const authToken = useAuthStore().authToken
    const requestUrl = `https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/v2/guilds/${guildId}/schedules/${scheduleId}`;

    try {
        const responseData: AxiosResponse<APIResponse<any>> = await axios.patch(requestUrl, {scheduleData}, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })

        return responseData?.data
    } catch (err) {
        const originResponseData: APIResponse<any> = err?.response?.data
        console.warn('API ERROR', 'Update Guild Schedule', err);
        return originResponseData || {success: false, data: null, error: err};
    }
}


/** Create guild schedule by id using backend API. */
export async function createSessionSchedule(guildId:string, scheduleData:SessionSchedule) {
    const authToken = useAuthStore().authToken
    const requestUrl = `https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/v2/guilds/${guildId}/schedules`;

    try {
        const responseData: AxiosResponse<APIResponse<any>> = await axios.post(requestUrl, {scheduleData}, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })

        return responseData?.data
    } catch (err) {
        const originResponseData: APIResponse<any> = err?.response?.data
        console.warn('API ERROR', 'Update Guild Schedule', err);
        return originResponseData || {success: false, data: null, error: err};
    }
}


/** Deletes guild schedule by id using backend API. */
export async function deleteSessionSchedule(guildId:string, scheduleId:string) {
    const authToken = useAuthStore().authToken
    const requestUrl = `https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/v2/guilds/${guildId}/schedules/${scheduleId}`;

    try {
        const responseData: AxiosResponse<APIResponse<any>> = await axios.delete(requestUrl, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })

        return responseData?.data
    } catch (err) {
        const originResponseData: APIResponse<any> = err?.response?.data
        console.warn('API ERROR', 'Update Guild Schedule', err);
        return originResponseData || {success: false, data: null, error: err};
    }
}