import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { JAM_ETH_NODE_AUTH } from "./constants";
import jam from "./types";

/**
 * Type Token. Used for typescript declarations
 */
export interface Token {
    token: string;
    exp: number;
}

interface TokenResponse {
    token: Token;
}

let cachedToken: Token;
function isExpired(token: Token): boolean {
    return token.exp - Math.floor(Date.now() / 1000) <= 30;
}

/**
 * Function that manages access token to be used for requests with JAM proxy for ethereum node.
 * @param apiKey
 */
export async function getAccessToken(apiKey: string): Promise<Token> {
    const config: AxiosRequestConfig = {
        method: "get",
        url: JAM_ETH_NODE_AUTH,
        headers: {
            "api-key": apiKey,
        },
    };
    return new Promise(async (resolve, reject) => {
        try {
            if (!cachedToken || isExpired(cachedToken)) {
                const response: AxiosResponse<TokenResponse> = await axios(
                    config
                );
                const { data: tokenResponse } = response;
                const { token } = tokenResponse;
                cachedToken = token;
            }
            resolve(cachedToken);
        } catch (err) {
            reject(err);
        }
    });
}
