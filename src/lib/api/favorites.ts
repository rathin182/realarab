export async function setFavorite(_listingId: string, _favorite: boolean): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 200));
  return true;
}
