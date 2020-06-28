import { search, searchState, searchCommunity } from '../index';

test('Search api - empty string', () => {
  return expect(search('')).rejects.toThrowError('Keyword cannot be empty');
});

test('Search api - no empty results', async () => {
  const results = await search('camb');
  for (let r of results) {
    expect(r.id).not.toBeNull();
  }
});

test('Search State', async () => {
  const results = await searchState('massachusetts');
  expect(results).not.toBeNull();
  for (let building of results) {
    expect(building.id).not.toBeNull();
    expect(building.name).not.toBeNull();
    expect(building.city).not.toBeNull();
    expect(building.state).not.toBeNull();
    expect(building.address).not.toBeNull();
    expect(building.type).not.toBeNull();
    expect(building.url).not.toBeNull();
    expect(building.count).not.toBeNull();
  }
});

test('Search Community', async () => {
  const results = await searchCommunity('MA040');
  expect(results).not.toBeNull();
  for (let apartment of results) {
    expect(apartment['id']).not.toBeNull();
    expect(apartment['communityID']).not.toBeNull();
    expect(apartment['apartmentNumber']).not.toBeNull();
    expect(apartment['apartmentAddress']).not.toBeNull();
    expect(apartment['price']).not.toBeNull();
    expect(apartment['size']).not.toBeNull();
    expect(apartment['beds']).not.toBeNull();
    expect(apartment['baths']).not.toBeNull();
    expect(apartment['floor']).not.toBeNull();
  }
});
