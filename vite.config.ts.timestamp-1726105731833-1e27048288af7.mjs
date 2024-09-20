// vite.config.ts
import { defineConfig } from "file:///D:/shopify_Dev_Hydrogen/shopifyTheme/shopify-ql/node_modules/vite/dist/node/index.js";
import { hydrogen } from "file:///D:/shopify_Dev_Hydrogen/shopifyTheme/shopify-ql/node_modules/@shopify/hydrogen/dist/vite/plugin.js";
import { oxygen } from "file:///D:/shopify_Dev_Hydrogen/shopifyTheme/shopify-ql/node_modules/@shopify/mini-oxygen/dist/vite/plugin.js";
import { vitePlugin as remix } from "file:///D:/shopify_Dev_Hydrogen/shopifyTheme/shopify-ql/node_modules/@remix-run/dev/dist/index.js";
import tsconfigPaths from "file:///D:/shopify_Dev_Hydrogen/shopifyTheme/shopify-ql/node_modules/vite-tsconfig-paths/dist/index.mjs";
import tailwindcss from "file:///D:/shopify_Dev_Hydrogen/shopifyTheme/shopify-ql/node_modules/@tailwindcss/vite/dist/index.mjs";
import { flatRoutes } from "file:///D:/shopify_Dev_Hydrogen/shopifyTheme/shopify-ql/node_modules/remix-flat-routes/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      },
      routes(definedRoutes) {
        return {
          ...flatRoutes("routes", definedRoutes)
          // ...definedRoutes((route)=>{
          //   route("/c","routes/c/_index/route.tsx",() =>{
          //     route("all","routes/c/all/route.tsx",()=>{
          //       route(":handle","routes/api-routes/c/collection.tsx",()=>{
          //         route("quickview","routes/api-routes/c/quickview.tsx")
          //       });
          //     });
          //   });
          // })
        };
      }
    }),
    tsconfigPaths()
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: []
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxzaG9waWZ5X0Rldl9IeWRyb2dlblxcXFxzaG9waWZ5VGhlbWVcXFxcc2hvcGlmeS1xbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcc2hvcGlmeV9EZXZfSHlkcm9nZW5cXFxcc2hvcGlmeVRoZW1lXFxcXHNob3BpZnktcWxcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3Nob3BpZnlfRGV2X0h5ZHJvZ2VuL3Nob3BpZnlUaGVtZS9zaG9waWZ5LXFsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQge2h5ZHJvZ2VufSBmcm9tICdAc2hvcGlmeS9oeWRyb2dlbi92aXRlJztcclxuaW1wb3J0IHtveHlnZW59IGZyb20gJ0BzaG9waWZ5L21pbmktb3h5Z2VuL3ZpdGUnO1xyXG5pbXBvcnQge3ZpdGVQbHVnaW4gYXMgcmVtaXh9IGZyb20gJ0ByZW1peC1ydW4vZGV2JztcclxuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XHJcblxyXG4vLyBcclxuaW1wb3J0IHsgZmxhdFJvdXRlc30gZnJvbSAncmVtaXgtZmxhdC1yb3V0ZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB0YWlsd2luZGNzcygpLFxyXG4gICAgaHlkcm9nZW4oKSxcclxuICAgIG94eWdlbigpLFxyXG4gICAgcmVtaXgoe1xyXG4gICAgICBwcmVzZXRzOiBbaHlkcm9nZW4ucHJlc2V0KCldLFxyXG4gICAgICBmdXR1cmU6IHtcclxuICAgICAgICB2M19mZXRjaGVyUGVyc2lzdDogdHJ1ZSxcclxuICAgICAgICB2M19yZWxhdGl2ZVNwbGF0UGF0aDogdHJ1ZSxcclxuICAgICAgICB2M190aHJvd0Fib3J0UmVhc29uOiB0cnVlLFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcm91dGVzKGRlZmluZWRSb3V0ZXMpe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAuLi5mbGF0Um91dGVzKCdyb3V0ZXMnLGRlZmluZWRSb3V0ZXMpLFxyXG4gICAgICAgICAgLy8gLi4uZGVmaW5lZFJvdXRlcygocm91dGUpPT57XHJcbiAgICAgICAgICAvLyAgIHJvdXRlKFwiL2NcIixcInJvdXRlcy9jL19pbmRleC9yb3V0ZS50c3hcIiwoKSA9PntcclxuICAgICAgICAgIC8vICAgICByb3V0ZShcImFsbFwiLFwicm91dGVzL2MvYWxsL3JvdXRlLnRzeFwiLCgpPT57XHJcbiAgICAgICAgICAvLyAgICAgICByb3V0ZShcIjpoYW5kbGVcIixcInJvdXRlcy9hcGktcm91dGVzL2MvY29sbGVjdGlvbi50c3hcIiwoKT0+e1xyXG4gICAgICAgICAgLy8gICAgICAgICByb3V0ZShcInF1aWNrdmlld1wiLFwicm91dGVzL2FwaS1yb3V0ZXMvYy9xdWlja3ZpZXcudHN4XCIpXHJcbiAgICAgICAgICAvLyAgICAgICB9KTtcclxuICAgICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAgIC8vICAgfSk7XHJcbiAgICAgICAgICAvLyB9KVxyXG5cclxuICAgICAgICAgIFxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuXHJcbiAgICB0c2NvbmZpZ1BhdGhzKCksXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgLy8gQWxsb3cgYSBzdHJpY3QgQ29udGVudC1TZWN1cml0eS1Qb2xpY3lcclxuICAgIC8vIHdpdGh0b3V0IGlubGluaW5nIGFzc2V0cyBhcyBiYXNlNjQ6XHJcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogMCxcclxuICB9LFxyXG4gIHNzcjoge1xyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBJbmNsdWRlIGRlcGVuZGVuY2llcyBoZXJlIGlmIHRoZXkgdGhyb3cgQ0pTPD5FU00gZXJyb3JzLlxyXG4gICAgICAgKiBGb3IgZXhhbXBsZSwgZm9yIHRoZSBmb2xsb3dpbmcgZXJyb3I6XHJcbiAgICAgICAqXHJcbiAgICAgICAqID4gUmVmZXJlbmNlRXJyb3I6IG1vZHVsZSBpcyBub3QgZGVmaW5lZFxyXG4gICAgICAgKiA+ICAgYXQgL1VzZXJzLy4uLi9ub2RlX21vZHVsZXMvZXhhbXBsZS1kZXAvaW5kZXguanM6MToxXHJcbiAgICAgICAqXHJcbiAgICAgICAqIEluY2x1ZGUgJ2V4YW1wbGUtZGVwJyBpbiB0aGUgYXJyYXkgYmVsb3cuXHJcbiAgICAgICAqIEBzZWUgaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9kZXAtb3B0aW1pemF0aW9uLW9wdGlvbnNcclxuICAgICAgICovXHJcbiAgICAgIGluY2x1ZGU6IFtdLFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VSxTQUFRLG9CQUFtQjtBQUNsVyxTQUFRLGdCQUFlO0FBQ3ZCLFNBQVEsY0FBYTtBQUNyQixTQUFRLGNBQWMsYUFBWTtBQUNsQyxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGlCQUFpQjtBQUd4QixTQUFTLGtCQUFpQjtBQUUxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxZQUFZO0FBQUEsSUFDWixTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFDSixTQUFTLENBQUMsU0FBUyxPQUFPLENBQUM7QUFBQSxNQUMzQixRQUFRO0FBQUEsUUFDTixtQkFBbUI7QUFBQSxRQUNuQixzQkFBc0I7QUFBQSxRQUN0QixxQkFBcUI7QUFBQSxNQUN2QjtBQUFBLE1BRUEsT0FBTyxlQUFjO0FBQ25CLGVBQU87QUFBQSxVQUNMLEdBQUcsV0FBVyxVQUFTLGFBQWE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQWF0QztBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUVELGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsT0FBTztBQUFBO0FBQUE7QUFBQSxJQUdMLG1CQUFtQjtBQUFBLEVBQ3JCO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxjQUFjO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVdaLFNBQVMsQ0FBQztBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
