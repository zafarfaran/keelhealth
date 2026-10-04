/**
 * Runs inline in <head>, before first paint and before React loads. It:
 * - marks <html> with `js`, so styles may hide things that animate in (nothing is hidden without JS);
 * - marks `still` for reduced motion or `?motion=off`, so nothing flashes before React knows;
 * - marks `lite` on data-saver, 2G or very low-memory devices, which get a still hero and no film;
 * - otherwise starts downloading the right hero film as soon as the fonts are in (low priority, so it
 *   never competes with the first paint), well before React would get round to it.
 *
 * Keep it small and dependency-free; it is inlined as a string.
 */
export const HERO_WIDE = "/assets/video/secondstrong-hero-wide.mp4";
export const HERO_TALL = "/assets/video/secondstrong-hero-tall.mp4";

export const bootScript = `(function(){
var d=document.documentElement;d.classList.add('js');
if(matchMedia('(prefers-reduced-motion: reduce)').matches||/[?&]motion=off/.test(location.search)){d.classList.add('still');return}
var c=navigator.connection||{},m=navigator.deviceMemory;
if(c.saveData||/2g$/.test(c.effectiveType||'')||(m&&m<1)){d.classList.add('lite');return}
var u=innerWidth/innerHeight<0.9?'${HERO_TALL}':'${HERO_WIDE}';
window.__ssHero={url:u,blob:document.fonts.ready.then(function(){return fetch(u,{priority:'low'})}).then(function(r){return r.blob()})};
})();`;

declare global {
  interface Window {
    __ssHero?: { url: string; blob: Promise<Blob> };
  }
}
