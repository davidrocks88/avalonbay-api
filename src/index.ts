const fetchUrl = require("fetch").fetchUrl;
const cheerio = require('cheerio')

const baseUrl = "https://www.avaloncommunities.com/";
const baseAPIUrl = "https://api.avalonbay.com";

export interface CommunitySearchResult {
    "id": string;
    "name": string;
    "city": string;
    "state": string;
    "address": string | null;
    "type": string;
    "url": string;
    "count": Number | null;
}

export interface ApartmentUnit {
    "id" : string;
    "communityID": string;
    "apartmentNumber" : string;
    "apartmentAddress": string;
    "price": Number;
    "size": Number;
    "beds": Number;
    "baths": Number;
    "floor": Number;
}

/**
 * @param keyword A keyword to search for, such as a state, city, or zipcode
 * @returns A list of communities relevant to the given keyword
 */
export async function search(keyword: string): Promise<CommunitySearchResult[]> {
    return new Promise<CommunitySearchResult[]>((resolve, reject) => {
        if (keyword.length === 0) {
            reject(new Error("Keyword cannot be empty"));
        }
        else {
            fetchUrl(`${baseAPIUrl}/search.json?query=${keyword}`, function (error: any, meta: any, body: any) {
                if (meta.status === 200) {
                    let parsedBody : CommunitySearchResult[] = JSON.parse(body).results;
                    parsedBody = parsedBody.filter((a : CommunitySearchResult) => a.id !== null)
                    resolve(parsedBody);
                } else {
                    reject(new Error(meta.status));
                }
            });
        }
    });
}

/**
 * @param state The state to lookup communities within, in the form of the state fully spelled out.
 *              For example, for Iowa, pass "iowa". Not case sensitive.
 * @returns A list of communities in the given state
 */
export async function searchState(state: string): Promise<CommunitySearchResult[]> {
    return new Promise<CommunitySearchResult[]>((resolve, reject) => {
        if (state.length === 0) {
            reject(new Error("State cannot be empty"));
        }
        else {
            state = state.toLowerCase();
            fetchUrl(`${baseUrl}/${state}`, function (error: any, meta: any, body: any) {
                try {
                    if (meta.status === 200) {
                        const $ = cheerio.load(body);
                        const list = $('.nearby-communities-list, .nearby-communities-list-horizontal')[0];
                        const titles = $('.title');
                        const addresses = $('.address');
                        const apartments : CommunitySearchResult[] = [];
                        for (let i in list.children) {
                            const address = addresses[i].children[0].data;
                            const apartmentBuilding : CommunitySearchResult = {
                                    "id": list.children[i].attribs["data-community"],
                                    "name": titles[i].children[0].children[0]["data"],
                                    "city": address.split(",")[0].split(" ").slice(-1)[0],
                                    "state": address.split(",")[1].trim().split(" ")[0],
                                    "address": address,
                                    "type": "community",
                                    "url": `${baseUrl}${titles[i].children[0].attribs['href']}`,
                                    "count": 0
                            }
                            apartments.push(apartmentBuilding);
                        }
                        resolve(apartments);
                    } else {
                        reject(new Error(meta.status));
                    }
                } catch(error) {
                    reject(error);
                }

            });
        }
    });
}

/**
 * @param comminityID The community ID to lookup
 * @returns A list of apartment units in the community
 */
export async function searchCommunity(comminityID: string): Promise<ApartmentUnit[]> {
    return new Promise<ApartmentUnit[]>((resolve, reject) => {
        if (comminityID.length === 0) {
            reject(new Error("communityID cannot be empty"));
        }
        else {
            comminityID = comminityID.toLowerCase();
            fetchUrl(`${baseAPIUrl}/json/reply/ApartmentSearch?communityCode=${comminityID}`, function (error: any, meta: any, body: any) {
                try {
                    if (meta.status === 200) {
                        const apartmentList : ApartmentUnit[] = [];
                        const results = JSON.parse(body).results;

                        for (let floorPlanType of results.availableFloorPlanTypes) {
                            for (let floorPlan of floorPlanType.availableFloorPlans) {
                                for (let finishPackage of floorPlan.finishPackages) {
                                    for (let apartment of finishPackage.apartments) {
                                        apartmentList.push({
                                            "id" : apartment.apartmentCode,
                                            "communityID": apartment.communityCode,
                                            "apartmentNumber" : apartment.apartmentNumber,
                                            "apartmentAddress": apartment.apartmentAddress,
                                            "price": apartment.pricing.effectiveRent,
                                            "size": apartment.apartmentSize,
                                            "beds": apartment.beds,
                                            "baths": apartment.baths,
                                            "floor": apartment.floor,  
                                        })
                                    }
                                }
                            }
                        }

                        resolve(apartmentList);
                    } else {
                        reject(new Error(meta.status));
                    }
                } catch(error) {
                    reject(error);
                }
            });
        }
    });
}