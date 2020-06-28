# avalonbay-api

An npm package used to query the avalonbay api.

*Note: This API should only be used for personal use. For Terms of Use, see [https://www.avaloncommunities.com/terms-of-use](https://www.avaloncommunities.com/terms-of-use)*.

## Usage
The package exports several methods that return promises. See the usage below.
```js
import { search, searchState, searchCommunity } from 'avalonbay-api';

// Does a fuzzy search for communities
search("camb")
    .then(results => console.log(results))

// Does a search for communnities in a given state
let communityID;
searchState("California")
   .then(communities => communityID = communities[0].id))

// Does a search for units within a community
searchCommunity(communityID)
    .then(units => console.log(units))

```

See https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c for instructions on how to build and publish an npm package.