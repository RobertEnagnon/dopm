import axios, {Method} from "axios";
import {Auth} from "./auth";

const PUBLIC_URL = process.env.REACT_APP_API;

export default class RequestService {
    token: string;
    constructor(token : string = '') {
        this.token = token
    }

    async fetchEndpoint(endpoint : string, method : Method = 'GET', data: any = null, stringify : boolean = true, locSto : any = undefined, anonymous : boolean = false, headers: any = {} ) {
        if(!anonymous) {
            if( typeof window !== 'undefined' ) {
                if( localStorage.getItem( 'authToken' ) !== null && localStorage.getItem( 'authToken' ) != '' ) {
                    this.token = localStorage.getItem( 'authToken' ) || '';
                }
                else {
                    let auth = await Auth();
                    if(auth?.ok) {
                        this.token = auth.response;
                        localStorage.setItem("authToken", this.token);
                    }
                }
            } else {
                if( locSto ) {
                    const localStorage = locSto;
                    if( localStorage.getItem( 'authToken' ) !== null ) {
                        this.token = localStorage.getItem( 'authToken' ) || '';
                    }
                    else {
                        let auth = await Auth();
                        if(auth?.ok) {
                            this.token = auth.response;
                            localStorage.setItem("authToken", this.token);
                        }
                    }
                }
            }
        }

        try {
            if( data === null ) {
                const res = await axios({
                    method: method,
                    url: `${PUBLIC_URL}/${endpoint}`,
                    headers: {
                        Authorization: (this.token && !anonymous) ? `Bearer ${this.token}` : '',
                        ...headers
                    }
                })
                if( res ) {
                    return await res;
                }
            }
            else {
                if(stringify) {
                    const res = await axios({
                        method: method,
                        url: `${PUBLIC_URL}/${endpoint}`,
                        headers: {
                            'content-type': 'application/json',
                            Authorization: (this.token && !anonymous) ? `Bearer ${this.token}` : '',
                            ...headers
                        },
                        data: JSON.stringify( data )
                    })
                    if( res ) {
                        return await res;
                    }
                } else {
                    const res = await axios({
                        method: method,
                        url: `${PUBLIC_URL}/${endpoint}`,
                        headers: {
                            Authorization: (this.token && !anonymous) ? `Bearer ${this.token}` : '',
                            ...headers
                        },
                        data: data
                    })
                    if( res ) {
                        return await res;
                    }
                }
            }
            // eslint-disable-next-line no-empty
        } catch (error) {
            if( (error as Error)?.message.includes('401') ) {
                localStorage.removeItem( 'user' );
                localStorage.removeItem( 'authToken' );
                window.location.reload();
            }

            if ( error instanceof SyntaxError) {
                console.log( error );
                return;
            }
            console.log( error );
        }
    }
}
