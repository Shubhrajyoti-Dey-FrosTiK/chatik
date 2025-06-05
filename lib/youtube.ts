const urlRegex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

export function isValidYoutubeURL(url: string): boolean {
  return !!String(url).match(urlRegex);
}

export function extractYoutubeId(url: string): string | undefined {
  const match = urlRegex.exec(url);
  return match ? match[1] : undefined;
}
