// Imported TypeScript:
// import { GuildDataResponse, SecureActionResponse, SecureActionNames } 
import { GuildDataResponse, SecureActionResponse, SecureActionNames } from "@sessionsbot/api-types";
import axios from "axios";


/** Fetches guild data from backend API.
 * @details
 * + Discord ➞ Guild API Data
 * + Discord ➞ Channels API Data
 * + Firestore ➞ Internal Guild Data
 * + and more...
 * @param guildId Discord Guild ID to fetch data for
 */
export async function getGuildData(guildId) : Promise <GuildDataResponse> {
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