// Imported TypeScript:
import { GuildDataResponse, SecureActionResponse } from './types/backendApi.types'


/** Fetches guild data from backend API.
 * 
 * + Discord Guild API Data
 * + Discord Guild ➞ Channels API Data
 * + Internal Firestore Guild Data
 * + and more...
 * @param guildId Discord Guild ID to fetch data for
 */
export async function getGuildData(guildId) : Promise <GuildDataResponse> {
    const requestUrl = 'https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/discord/guild?guildId=' + guildId;

    let responseData : GuildDataResponse;

    try {
        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        responseData = await response.json();
        return responseData;

    } catch (error) {
        console.warn('API ERROR', 'FETCH GUILD DATA: ', error);
        responseData = {
            success: false,
            data: null,
            error
        };
        return responseData;
    }
}


/** Attempt to POST/execute a 'secure action' within the backend API.
 * 
 * - Requires Authentication (via token)
 * - Specified Secure Actions Available
 *      - Otherwise, make a direct API call...
 * 
 * @param authToken Authentication token to provide for secure action attempt.
 * 
 * @param actionType The secure action to attempt to execute.
 * 
 * @param data Any further data to provide for the call
 * 
 * - Please reference backend code for necessary objects to provide!
 */
export async function postSecureAction(authToken:string, actionType:string, data?:any) : Promise <SecureActionResponse> {
    
    // Return no logic alert:
    return {
        success: false, 
        error: {code:500, message: 'This Secure Action fn logic has not been completed yet!'}
    }
}