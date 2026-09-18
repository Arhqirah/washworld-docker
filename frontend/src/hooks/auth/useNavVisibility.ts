// Re-eksporterer useNavVisibility fra ScreenLayout.tsx så hooks-mappen er det eneste import-sted.
// Bruges af not-found.tsx (404-siden) til at skjule navigationsmenuen på fejlsider.
// Selve implementeringen og NavVisibilityContext ligger i components/ScreenLayout.tsx.
export { useNavVisibility } from "@/components/layout/ScreenLayout";
