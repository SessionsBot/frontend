// @ts-check

/**
 * Gets guild data from backend API.
 * @param {String} guildId Discord guild id to fetch data for
 * @returns Response Object:
 *  ```typescript
 * {
 *      success: Boolean, 
 *      data: Object | String | null,
 *      error: String | Object | null
 * } 
 * ```
 */
export async function getGuildData(guildId) {
    const requestUrl = 'https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/discord/guild?guildId=' + guildId;
    try {
        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseData = await response.json();
        console.log('DATA FETCHED:', responseData);
        return responseData;
    } catch (error) {
        console.warn('FAILED TO FETCH GUILD DATA: ', error);
        return {
            success: false,
            data: null,
            error
        };
    }
}