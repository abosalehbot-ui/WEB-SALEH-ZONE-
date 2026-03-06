export type ThemeName = "default" | "synthwave" | "sith" | "vip";

export const THEMES: ThemeName[] = ["default", "synthwave", "sith", "vip"];

export const isThemeName = (value: string): value is ThemeName => THEMES.includes(value as ThemeName);
