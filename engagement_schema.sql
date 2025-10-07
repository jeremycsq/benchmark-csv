-- Engagement table schema for Supabase (PostgreSQL)
-- Columns match CSV headers exactly (quoted identifiers) for seamless import

begin;

create table if not exists public.engagement (
  "ANALYSIS_MONTH" date not null,
  "INDUSTRY" text not null,
  "COUNTRY_CODE" text not null,
  "DEVICE_ID" text not null,

  "AVG_PAGEVIEWS_PER_SESSION" double precision,
  "AVG_TIME_SPENT_PER_SESSION" double precision,
  "AVG_SCROLL_RATE" double precision,
  "AVG_ACTIVITY_RATE" double precision,

  "AVG_NEW_VISITOR_PAGEVIEWS" double precision,
  "AVG_NEW_VISITOR_TIME_SPENT" double precision,
  "AVG_NEW_VISITOR_SCROLL_RATE" double precision,
  "AVG_NEW_VISITOR_ACTIVITY_RATE" double precision,

  "AVG_RETURNING_VISITOR_PAGEVIEWS" double precision,
  "AVG_RETURNING_VISITOR_TIME_SPENT" double precision,
  "AVG_RETURNING_VISITOR_SCROLL_RATE" double precision,
  "AVG_RETURNING_VISITOR_ACTIVITY_RATE" double precision,

  "PAGEVIEWS_P25" double precision,
  "PAGEVIEWS_P75" double precision,
  "TIME_SPENT_P25" double precision,
  "TIME_SPENT_P75" double precision,
  "SCROLL_RATE_P25" double precision,
  "SCROLL_RATE_P75" double precision,
  "ACTIVITY_RATE_P25" double precision,
  "ACTIVITY_RATE_P75" double precision,

  "NEW_VISITOR_PAGEVIEWS_P25" double precision,
  "NEW_VISITOR_PAGEVIEWS_P75" double precision,
  "NEW_VISITOR_TIME_SPENT_P25" double precision,
  "NEW_VISITOR_TIME_SPENT_P75" double precision,
  "NEW_VISITOR_SCROLL_RATE_P25" double precision,
  "NEW_VISITOR_SCROLL_RATE_P75" double precision,
  "NEW_VISITOR_ACTIVITY_RATE_P25" double precision,
  "NEW_VISITOR_ACTIVITY_RATE_P75" double precision,

  "RETURNING_VISITOR_PAGEVIEWS_P25" double precision,
  "RETURNING_VISITOR_PAGEVIEWS_P75" double precision,
  "RETURNING_VISITOR_TIME_SPENT_P25" double precision,
  "RETURNING_VISITOR_TIME_SPENT_P75" double precision,
  "RETURNING_VISITOR_SCROLL_RATE_P25" double precision,
  "RETURNING_VISITOR_SCROLL_RATE_P75" double precision,
  "RETURNING_VISITOR_ACTIVITY_RATE_P25" double precision,
  "RETURNING_VISITOR_ACTIVITY_RATE_P75" double precision,

  "HP_LANDING_RATE_P25" double precision,
  "HP_LANDING_RATE_P75" double precision,
  "HP_BOUNCE_RATE_P25" double precision,
  "HP_BOUNCE_RATE_P75" double precision,
  "HP_EXIT_RATE_P25" double precision,
  "HP_EXIT_RATE_P75" double precision,
  "HP_ACTIVITY_RATE_P25" double precision,
  "HP_ACTIVITY_RATE_P75" double precision,
  "HP_PV_SHARE_P25" double precision,
  "HP_PV_SHARE_P75" double precision,

  "PAGEVIEWS_YOY_CHANGE" double precision,
  "TIME_SPENT_YOY_CHANGE" double precision,
  "SCROLL_RATE_YOY_CHANGE" double precision,
  "ACTIVITY_RATE_YOY_CHANGE" double precision,

  "NEW_VISITOR_PAGEVIEWS_YOY_CHANGE" double precision,
  "NEW_VISITOR_TIME_SPENT_YOY_CHANGE" double precision,
  "NEW_VISITOR_SCROLL_RATE_YOY_CHANGE" double precision,
  "NEW_VISITOR_ACTIVITY_RATE_YOY_CHANGE" double precision,

  "RETURNING_VISITOR_PAGEVIEWS_YOY_CHANGE" double precision,
  "RETURNING_VISITOR_TIME_SPENT_YOY_CHANGE" double precision,
  "RETURNING_VISITOR_SCROLL_RATE_YOY_CHANGE" double precision,
  "RETURNING_VISITOR_ACTIVITY_RATE_YOY_CHANGE" double precision,

  "PAGEVIEWS_MOM_CHANGE" double precision,
  "TIME_SPENT_MOM_CHANGE" double precision,
  "SCROLL_RATE_MOM_CHANGE" double precision,
  "ACTIVITY_RATE_MOM_CHANGE" double precision,

  "NEW_VISITOR_PAGEVIEWS_MOM_CHANGE" double precision,
  "NEW_VISITOR_TIME_SPENT_MOM_CHANGE" double precision,
  "NEW_VISITOR_SCROLL_RATE_MOM_CHANGE" double precision,
  "NEW_VISITOR_ACTIVITY_RATE_MOM_CHANGE" double precision,

  "RETURNING_VISITOR_PAGEVIEWS_MOM_CHANGE" double precision,
  "RETURNING_VISITOR_TIME_SPENT_MOM_CHANGE" double precision,
  "RETURNING_VISITOR_SCROLL_RATE_MOM_CHANGE" double precision,
  "RETURNING_VISITOR_ACTIVITY_RATE_MOM_CHANGE" double precision,

  "HOMEPAGE_LANDING_RATE" double precision,
  "HOMEPAGE_BOUNCE_RATE" double precision,
  "HOMEPAGE_EXIT_RATE" double precision,
  "HOMEPAGE_ACTIVITY_RATE" double precision,
  "HOMEPAGE_PV_SHARE" double precision,

  "PRODUCT_LANDING_RATE" double precision,
  "PRODUCT_BOUNCE_RATE" double precision,
  "PRODUCT_EXIT_RATE" double precision,
  "PRODUCT_ACTIVITY_RATE" double precision,
  "PRODUCT_PV_SHARE" double precision,

  "CATEGORY_LANDING_RATE" double precision,
  "CATEGORY_BOUNCE_RATE" double precision,
  "CATEGORY_EXIT_RATE" double precision,
  "CATEGORY_ACTIVITY_RATE" double precision,
  "CATEGORY_PV_SHARE" double precision,

  "NB_SESSIONS" bigint,
  "NB_SESSIONS_NEW" bigint,
  "NB_SESSIONS_RETURNING" bigint,
  "PAGEVIEWS" bigint,
  "TOTAL_TIME_SPENT_SEC" bigint,

  "UPDATED_AT" timestamptz,

  constraint engagement_pkey primary key ("ANALYSIS_MONTH", "INDUSTRY", "COUNTRY_CODE", "DEVICE_ID")
);

-- Helpful indexes for typical filters
create index if not exists engagement_analysis_month_idx on public.engagement ("ANALYSIS_MONTH");
create index if not exists engagement_industry_idx on public.engagement ("INDUSTRY");
create index if not exists engagement_country_idx on public.engagement ("COUNTRY_CODE");

commit;


