// @ts-check

// ! TO-DO & Notes: !
// - Learn more about JSDOC / TypeScript!
// + How to add the whole '?data' completion for variable that might not be available?
// + Learn useful/most common '@' descriptors?
// + Reference backend api's/responses to created the best intelsense/typescript for interal APIs


/**
 * @typedef {Object} APIErrorResponse The Error Response Object for applicable API endpoint.
 * @property {Number} code Error response code
 * @property {any} message Any error details provided
 */

/**
 * @typedef {Object} GuildDataResponse The full API response object for fetching guild data.
 * @property {boolean} success Whether the request was successful.
 * @property {?GuildData} data The response data, if any.
 * @property {?APIErrorResponse} error Any error details, if any.
 */

/**
 * @typedef {Object} GuildData The data object returned from fetching Guild Data.
 * @property {Object} guildGeneral Information provided from Discord's 'Guild' API. (name, id, members, metadata)
 * @property {Object} guildChannels Full list results of available channels for the specified guild.
 */


/**
 * Gets guild data from backend API.
 * @param {String} guildId Discord guild id to fetch data for
 * @returns {Promise<GuildDataResponse>}
 */
export async function getGuildData(guildId) {
    const requestUrl = 'https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/discord/guild?guildId=' + guildId;
    
    let responseData;

    try {
        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        responseData = await response.json();
        console.log('DATA FETCHED:', responseData);
        return responseData;
    } catch (error) {
        console.warn('FAILED TO FETCH GUILD DATA: ', error);
        responseData = {
            success: false,
            data: null,
            error
        };
        return responseData;
    }
}