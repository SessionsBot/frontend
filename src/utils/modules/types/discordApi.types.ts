/** Information provided from Discord's 'Guild' API.
* This follows the schema of Discord's GET /guilds/:id endpoint:
* @resource https://discord.com/developers/docs/resources/guild#get-guild
*/
export interface GuildGeneralData {
    id?:                             string;
    name?:                           string;
    icon?:                           unknown;
    description?:                    unknown;
    home_header?:                    unknown;
    splash?:                         unknown;
    discovery_splash?:               unknown;
    features?:                       any[];
    banner?:                         unknown;
    owner_id?:                       string;
    application_id?:                 unknown;
    region?:                         string;
    afk_channel_id?:                 unknown;
    afk_timeout?:                    number;
    system_channel_id?:              string;
    system_channel_flags?:           number;
    widget_enabled?:                 boolean;
    widget_channel_id?:              unknown;
    verification_level?:             number;
    roles?:                          Role[];
    default_message_notifications?:  number;
    mfa_level?:                      number;
    explicit_content_filter?:        number;
    max_presences?:                  unknown;
    max_members?:                    number;
    max_stage_video_channel_users?:  number;
    max_video_channel_users?:        number;
    vanity_url_code?:                unknown;
    premium_tier?:                   number;
    premium_subscription_count?:     number;
    preferred_locale?:               string;
    rules_channel_id?:               unknown;
    safety_alerts_channel_id?:       unknown;
    public_updates_channel_id?:      unknown;
    hub_type?:                       unknown;
    premium_progress_bar_enabled?:   boolean;
    latest_onboarding_question_id?:  unknown;
    nsfw?:                           boolean;
    nsfw_level?:                     number;
    owner_configured_content_level?: number;
    emojis?:                         any[];
    stickers?:                       any[];
    incidents_data?:                 unknown;
    inventory_settings?:             unknown;
    embed_enabled?:                  boolean;
    embed_channel_id?:               unknown;
}


export interface Role {
    id?:            string;
    name?:          string;
    description?:   unknown;
    permissions?:   string;
    position?:      number;
    color?:         number;
    colors?:        Colors;
    hoist?:         boolean;
    managed?:       boolean;
    mentionable?:   boolean;
    icon?:          unknown;
    unicode_emoji?: unknown;
    flags?:         number;
    tags?:          unknown;
}


export interface Colors {
    primary_color?:   number;
    secondary_color?: unknown;
    tertiary_color?:  unknown;
}


/** Information provided from Discord's 'Guild Channels' API.
* This follows the schema of Discord's GET /guilds/:id/channels endpoint:
* @resource https://discord.com/developers/docs/resources/channel#channel-object
*/
export interface GuildChannelData {
    id?:                       string;
    type?:                     number;
    flags?:                    number;
    guild_id?:                 string;
    name?:                     string;
    parent_id?:                null | string;
    position?:                 number;
    permission_overwrites?:    PermissionOverwrite[];
    last_message_id?:          null | string;
    rate_limit_per_user?:      number;
    topic?:                    null;
    nsfw?:                     boolean;
    icon_emoji?:               IconEmoji;
    theme_color?:              null;
    bitrate?:                  number;
    user_limit?:               number;
    rtc_region?:               null;
    voice_background_display?: null;
}

export interface IconEmoji {
    id?:   null;
    name?: string;
}
export interface PermissionOverwrite {
    id?:    string;
    type?:  number;
    allow?: string;
    deny?:  string;
}
