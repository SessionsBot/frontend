// Imported Types:
import { GuildChannelData, GuildGeneralData } from "./discordApi.types"
import { FirebaseGuildDoc } from "./firestoreData.types";


/** The full interface response for internal backend API. */
export interface APIResponse<responseData> {
    /** Whether the API request was successful. */
    success: boolean;

    /** The API response data, if any. */
    data?: responseData;

    /** Any API error details, if any. */
    error?: APIErrorData;
}

/** The Error Response Object for applicable API endpoint. */
export interface APIErrorData {
    /** Error response code */
    code: number

    /** Error details/message, if any */
    message?: unknown
}



/** The full API response object for fetching guild data. */
export type GuildDataResponse = APIResponse<GuildData>;

/** The data object returned from fetching Guild Data.
 * 
 *  + See {@link GuildDataResponse}
 */
export interface GuildData {
    /** Information provided from Discord's 'Guild' API.
    * This follows the schema of Discord's GET /guilds/:id endpoint:
    * @resource https://discord.com/developers/docs/resources/guild#get-guild
    */
    guildGeneral: GuildGeneralData;

    /** Array of channel objects from Discord's GET /guilds/:id/channels endpoint:
    * @resource https://discord.com/developers/docs/resources/channel#channel-object
    */
    guildChannels?: GuildChannelData[];

    /** Full Firebase document data saved internally for guild, if any. */
    guildDatabaseData?: FirebaseGuildDoc;

    /** Boolean indication if Sessions Bot is a member within specified guild. */
    sessionsBotInGuild: boolean;

    /** URL of specified guild's icon image, if any. */
    guildIcon?: string;

    /** URL of specified guild's banner image, if any. */
    guildBanner?: string;


}


/** The full API response object for a "Secure Action" attempt. */
export type SecureActionResponse = APIResponse<unknown>;