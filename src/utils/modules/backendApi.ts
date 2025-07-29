// Imported TypeScript:
// import { GuildDataResponse, SecureActionResponse, SecureActionNames } 
import { GuildDataResponse, SecureActionResponse, SecureActionNames } from "@sessionsbot/api-types";


/** Fetches guild data from backend API.
 * @details
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
        console.warn('API ERROR', 'Fetch Guild Data', error);
        responseData = {
            success: false,
            data: null,
            error
        };
        return responseData;
    }
}


/** Attempts to execute a **secure action** within the backend API.
 *
 * @details 
 * - Requires Authentication (via token)
 * - *Specified Secure Actions Available*
 *      - Otherwise, make a direct API call...
 * 
 * @param authToken Authentication token to provide for secure action attempt.
 * 
 * @param actionType The secure action to attempt to execute.
 * 
 * @param guildId The Discord guild by ID to perform the secure action.
 * 
 * @param requestData Any further data to provide for the request, Please view the [backend API code](https://github.com/SessionsBot/backend/blob/main/src/webService) for required data for each action type.
 */
export async function attemptSecureAction(authToken:string, actionType:SecureActionNames, guildId?:string, requestData?:any) : Promise <SecureActionResponse> {
    
    let responseData : SecureActionResponse;

    try {
        // 1. Attempt Secure Action:
        const requestUrl = `https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/secure-action`;
        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                actionType: 'SETUP-GUILD',
                guildId: guildId || 'null',
                data: requestData
            })
        })

        // 2. Get Request Response:
        responseData = await response.json()

        // 3. Check for Errors:
        if(!responseData?.success) {
            // Error Occurred:
            throw responseData?.error?.message
        }
            
        // 4. Success:
        return responseData
        
    
    } catch (error) {
        // Error Occurred:
        console.warn('API ERROR', 'Secure Action', error);
        // Return Error:
        return responseData = {
            success: false,
            error: {
                code: 500,
                message: error
            }
        }
    }

}