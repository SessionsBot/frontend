// Imported TypeScript:
// import { GuildDataResponse, SecureActionResponse, SecureActionNames } 
import type { APIErrorData, APIResponse, GuildDataResponse, SessionSchedule } from "@sessionsbot/api-types";
import axios, { AxiosResponse } from "axios";
import { useAuthStore } from "../stores/auth";
import { usePopupSystem } from "../stores/popup";
import router from "../router";


export interface systemStatusObject {
    /** The identifier for this system on the status page. */
    id: string,
    /** The name of this system on the status page. */
    name: string,
    /** The current status for this system on the status page. */
    status: string,
}

/** Fetch current system statuses from Better Stack.
 * @returns Array of objects containing data of the system and status.
 */
export async function getSystemStatuses(): Promise<APIResponse<systemStatusObject[]>> {
    let responseData : APIResponse<systemStatusObject[]>
    const requestUrl = 'https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/v2/system/status';

    try {
        const sysStatusFetchResults = await axios.get(requestUrl);
        if(!sysStatusFetchResults?.data) throw 'No system status data provided, please try again!';
        
        // return fetched data:
        responseData = sysStatusFetchResults.data
        return responseData

    } catch (error) {
        console.warn('API ERROR', 'Fetch System Statuses', error);
        // return error:
        if(error?.response?.data) return error?.response?.data // Return response error data if possible
        else responseData = {
                success: false,
                data: null,
                error
            };
        return responseData;
    }
}
/** Module function to check and alert for backend system status incidents. */
export async function checkBackendStatus() {
    // Get all system statuses:
    const systemStatuses = await getSystemStatuses()
    if(systemStatuses.success){
        // Get main backend status:
        const backendStatus = systemStatuses.data.find(sys => sys.name.includes('Backend'));
        if(!backendStatus || backendStatus?.status != 'operational'){ 
            // Backend degraded/offline:
            const popupSystem = usePopupSystem()
            console.warn('Backend server is not fully operational! Please see status page at https://status.sessiosnbot.fyi.', backendStatus)
            if(backendStatus?.status == 'downgraded') { 
                popupSystem.backendDegraded = true; 
            }
            if(backendStatus?.status == 'downtime') { 
                popupSystem.backendOffline = true; 
                router.push('/offline');
            }
            // usePopupSystem().showPopup('Uh oh!', 'It appears our Discord Bot / Backend systems are experiencing a service outage! Please visit our status page for more details...', false, [{label: 'Visit Status Page', fn: () => {defaultWindow.open('https://status.sessionsbot.fyi')}}, {label: 'Dismiss', fn: () => { usePopupSystem().closePopup() }}])
        } else { 
            // Backend operational
            console.info('Backend operational!', backendStatus)
        }
    }else{
        console.warn('System Status', 'FAILURE', systemStatuses)
    }
}

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