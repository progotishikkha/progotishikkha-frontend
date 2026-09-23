/**
 * Every uploaded profile photo goes to Cloudinary and has a real URL, but a
 * user who hasn't uploaded one yet has none — several components render an
 * <Image> unconditionally and need *some* URL. This generates a clean
 * initials avatar instead of leaving a broken image.
 */
export function avatarUrlFor(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E3A5F&color=fff&size=128`;
}
