;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="0283493b-e087-5c80-c79c-f4361fbda0ec")}catch(e){}}();
module.exports=[665742,e=>{"use strict";var t=e.i(872920),r=e.i(10631),a=e.i(158160),i=e.i(242185),n=e.i(345655),o=e.i(966885),l=e.i(104562),s=e.i(805286),c=e.i(479947),g=e.i(538818),u=e.i(95391),d=e.i(18228),p=e.i(368142),h=e.i(447497),m=e.i(351289),y=e.i(193695);e.i(33408);var v=e.i(533036),f=e.i(57429),_=e.i(670692);let x='(language == $language || (!defined(language) && $language == "en"))',b=_.groq`
  *[_type == "post" && ${x}] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImageUrl, coverImage),
    content,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`;_.groq`
  *[_type == "post" && slug.current == $slug && ${x}][0] {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImageUrl, coverImage),
    content,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`,_.groq`
  *[_type == "post" && featured == true && ${x}] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImageUrl, coverImage),
    content,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`,_.groq`
  *[_type == "post" && category == $category && ${x}] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImageUrl, coverImage),
    content,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`,_.groq`
  *[_type == "post" && $tagName in tags && ${x}] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImageUrl, coverImage),
    content,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`,_.groq`
  array::unique(*[_type == "post" && ${x}].category)
`,_.groq`
  array::unique(*[_type == "post" && ${x}].tags[])
`,_.groq`
  *[_type == "project" && ${x}] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    description,
    "longDescription": pt::text(longDescription),
    "image": coalesce(image.asset->url, imageUrl, image),
    "technologies": technologies[]->name,
    liveUrl,
    githubUrl,
    featured,
    category,
    year,
    challenges,
    solutions,
    impact,
    testimonial,
    achievements,
    showOnCV,
    language
  }
`,_.groq`
  *[_type == "project" && slug.current == $slug && ${x}][0] {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    description,
    "longDescription": pt::text(longDescription),
    "image": coalesce(image.asset->url, imageUrl, image),
    "technologies": technologies[]->name,
    liveUrl,
    githubUrl,
    featured,
    category,
    year,
    challenges,
    solutions,
    impact,
    testimonial,
    achievements,
    showOnCV,
    language
  }
`,_.groq`
  *[_type == "project" && featured == true && ${x}] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    description,
    "image": coalesce(image.asset->url, imageUrl, image),
    "technologies": technologies[]->name,
    category,
    year,
    language
  }
`,_.groq`
  *[_type == "project" && showOnCV == true && ${x}] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    description,
    "technologies": technologies[]->name,
    category,
    year,
    language
  }
`,_.groq`
  *[_type == "experience" && ${x}] | order(startDate desc) {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    company,
    "companyLogo": coalesce(companyLogo.asset->url, companyLogoUrl, companyLogo),
    companyUrl,
    period,
    startDate,
    endDate,
    location,
    "description": pt::text(description),
    "longDescription": pt::text(longDescription),
    "technologies": technologies[]->name,
    color,
    highlights,
    achievements,
    responsibilities,
    teamSize,
    impact,
    language
  }
`,_.groq`
  *[_type == "experience" && slug.current == $slug && ${x}][0] {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    company,
    "companyLogo": coalesce(companyLogo.asset->url, companyLogoUrl, companyLogo),
    companyUrl,
    period,
    startDate,
    endDate,
    location,
    "description": pt::text(description),
    "longDescription": pt::text(longDescription),
    "technologies": technologies[]->name,
    color,
    highlights,
    achievements,
    responsibilities,
    teamSize,
    impact,
    language
  }
`,_.groq`
  *[_type == "hero" && ${x}][0] {
    _id,
    name,
    title,
    subtitle,
    tagline,
    ctaButtons,
    stats,
    language
  }
`,_.groq`
  *[_type == "aboutSection" && ${x}][0] {
    _id,
    name,
    title,
    "subtitle": titleHighlight,
    "description": pt::text(intro),
    highlights,
    "image": coalesce(image.asset->url, image),
    language
  }
`,_.groq`
  *[_type == "contactSection" && ${x}][0] {
    _id,
    name,
    title,
    subtitle,
    description,
    email,
    phone,
    location,
    socialLinks,
    language
  }
`,_.groq`
  *[_type == "projectsSection" && ${x}][0] {
    _id,
    name,
    title,
    titleHighlight,
    subtitle,
    language
  }
`,_.groq`
  *[_type == "experienceSection" && ${x}][0] {
    _id,
    name,
    title,
    titleHighlight,
    subtitle,
    language
  }
`,_.groq`
  *[_type == "skillsSection" && ${x}][0] {
    _id,
    name,
    title,
    titleHighlight,
    subtitle,
    skills,
    language
  }
`,_.groq`
  *[_type == "blogSection" && ${x}][0] {
    _id,
    name,
    title,
    titleHighlight,
    subtitle,
    language
  }
`,_.groq`
  *[_type == "techStackSection" && ${x}][0] {
    _id,
    name,
    title,
    titleHighlight,
    subtitle,
    categories[] {
      name,
      icon,
      technologies[] {
        name,
        icon,
        color,
        proficiency
      }
    },
    language
  }
`,_.groq`
  *[_type == "service" && ${x}] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    description,
    longDescription,
    icon,
    gradient,
    features,
    technologies,
    processSteps[] {
      title,
      description
    },
    benefits,
    faqs[] {
      question,
      answer
    },
    stats[] {
      value,
      label,
      icon
    },
    caseStudies[] {
      title,
      description,
      results,
      image
    },
    order,
    language
  }
`,_.groq`
  *[_type == "service" && slug.current == $slug && ${x}][0] {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    description,
    longDescription,
    icon,
    gradient,
    features,
    technologies,
    processSteps[] {
      title,
      description
    },
    benefits,
    faqs[] {
      question,
      answer
    },
    stats[] {
      value,
      label,
      icon
    },
    caseStudies[] {
      title,
      description,
      results,
      image
    },
    order,
    language
  }
`;let R=process.env.NEXT_PUBLIC_SITE_URL||"https://www.leroysteding.nl",$="Leroy Steding",w="hello@leroysteding.nl";function E(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function C(e){return new Date(e).toUTCString()}function q(e){var t;let r="string"==typeof(t=e.slug)?t:t?.current||"",a=`${R}/en/blog/${r}`,i=C(e.publishedAt),n=e.tags.map(e=>`<category>${E(e)}</category>`).join("\n      ");return`
    <item>
      <title>${E(e.title)}</title>
      <link>${a}</link>
      <guid isPermaLink="true">${a}</guid>
      <description>${E(e.excerpt||"")}</description>
      <pubDate>${i}</pubDate>
      <author>${w} (${$})</author>
      ${n}
    </item>`}function A(e){let t=C(new Date().toISOString()),r=e.map(q).join("\n");return`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${E("Leroy Steding - Blog")}</title>
    <link>${R}/en/blog</link>
    <description>${E("Articles about web development, React, Next.js, and software engineering best practices.")}</description>
    <language>en</language>
    <lastBuildDate>${t}</lastBuildDate>
    <atom:link href="${R}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
    <managingEditor>${w} (${$})</managingEditor>
    <webMaster>${w} (${$})</webMaster>
    <ttl>60</ttl>
    ${r}
  </channel>
</rss>`}async function S(){try{let e=(await f.client.fetch(b,{language:"en"})).sort((e,t)=>new Date(t.publishedAt).getTime()-new Date(e.publishedAt).getTime()).slice(0,20),t=A(e);return new Response(t,{status:200,headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}catch(e){return console.error("Error generating RSS feed:",e),new Response(A([]),{status:200,headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=300"}})}}e.s(["GET",()=>S],857595);var I=e.i(857595);let T=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/feed.xml/route",pathname:"/feed.xml",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/apps/portfolio/app/feed.xml/route.ts",nextConfigOutput:"",userland:I}),{workAsyncStorage:D,workUnitAsyncStorage:U,serverHooks:N}=T;function O(){return(0,a.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:U})}async function P(e,t,a){T.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let f="/feed.xml/route";f=f.replace(/\/index$/,"")||"/";let _=await T.prepare(e,t,{srcPage:f,multiZoneDraftMode:!1});if(!_)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:x,params:b,nextConfig:R,parsedUrl:$,isDraftMode:w,prerenderManifest:E,routerServerContext:C,isOnDemandRevalidate:q,revalidateOnlyGenerated:A,resolvedPathname:S,clientReferenceManifest:I,serverActionsManifest:D}=_,U=(0,l.normalizeAppPath)(f),N=!!(E.dynamicRoutes[U]||E.routes[S]),O=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,$,!1):t.end("This page could not be found"),null);if(N&&!w){let e=!!E.routes[S],t=E.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(R.experimental.adapterPath)return await O();throw new y.NoFallbackError}}let P=null;!N||T.isDev||w||(P="/index"===(P=S)?"/":P);let k=!0===T.isDev||!N,H=N&&!k;D&&I&&(0,o.setManifestsSingleton)({page:f,clientReferenceManifest:I,serverActionsManifest:D});let L=e.method||"GET",j=(0,n.getTracer)(),M=j.getActiveScopeSpan(),B={params:b,prerenderManifest:E,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:k,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:R.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,i)=>T.onRequestError(e,t,a,i,C)},sharedContext:{buildId:x}},F=new s.NodeNextRequest(e),K=new s.NodeNextResponse(t),V=c.NextRequestAdapter.fromNodeNextRequest(F,(0,c.signalFromNodeResponse)(t));try{let o=async e=>T.handle(V,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==g.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${L} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${L} ${f}`)}),l=!!(0,i.getRequestMeta)(e,"minimalMode"),s=async i=>{var n,s;let c=async({previousCacheEntry:r})=>{try{if(!l&&q&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(i);e.fetchMetrics=B.renderOpts.fetchMetrics;let s=B.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let c=B.renderOpts.collectedTags;if(!N)return await (0,d.sendResponse)(F,K,n,B.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(n.headers);c&&(t[m.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,a=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:f,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:q})},!1,C),t}},g=await T.handleResponse({req:e,nextConfig:R,cacheKey:P,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:E,isRoutePPREnabled:!1,isOnDemandRevalidate:q,revalidateOnlyGenerated:A,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:l});if(!N)return null;if((null==g||null==(n=g.value)?void 0:n.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==g||null==(s=g.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});l||t.setHeader("x-nextjs-cache",q?"REVALIDATED":g.isMiss?"MISS":g.isStale?"STALE":"HIT"),w&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let y=(0,p.fromNodeOutgoingHttpHeaders)(g.value.headers);return l&&N||y.delete(m.NEXT_CACHE_TAGS_HEADER),!g.cacheControl||t.getHeader("Cache-Control")||y.get("Cache-Control")||y.set("Cache-Control",(0,h.getCacheControlHeader)(g.cacheControl)),await (0,d.sendResponse)(F,K,new Response(g.value.body,{headers:y,status:g.value.status||200})),null};M?await s(M):await j.withPropagatedContext(e.headers,()=>j.trace(g.BaseServerSpan.handleRequest,{spanName:`${L} ${f}`,kind:n.SpanKind.SERVER,attributes:{"http.method":L,"http.target":e.url}},s))}catch(t){if(t instanceof y.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:q})},!1,C),N)throw t;return await (0,d.sendResponse)(F,K,new Response(null,{status:500})),null}}e.s(["handler",()=>P,"patchFetch",()=>O,"routeModule",()=>T,"serverHooks",()=>N,"workAsyncStorage",()=>D,"workUnitAsyncStorage",()=>U],665742)}];

//# debugId=0283493b-e087-5c80-c79c-f4361fbda0ec
//# sourceMappingURL=83f50_next_dist_esm_build_templates_app-route_f2830eec.js.map