import fs from 'fs'
import path from 'path'
import { DatabaseSync } from 'node:sqlite'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'rankwave.db')

let dbInstance: DatabaseSync | null = null

export function getDatabase(): DatabaseSync {
  if (dbInstance) return dbInstance

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  dbInstance = new DatabaseSync(DB_PATH)
  
  // Enable WAL mode & foreign keys for high performance and integrity
  dbInstance.exec('PRAGMA journal_mode = WAL;')
  dbInstance.exec('PRAGMA foreign_keys = ON;')

  initializeTables(dbInstance)
  seedInitialDataIfNeeded(dbInstance)

  return dbInstance
}

function initializeTables(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      website_url TEXT NOT NULL,
      description TEXT,
      niche TEXT,
      target_countries TEXT,
      target_audience TEXT,
      primary_keywords TEXT,
      secondary_keywords TEXT,
      target_landing_pages TEXT,
      preferred_anchors TEXT,
      brand_voice TEXT,
      seo_objectives TEXT,
      content_language TEXT DEFAULT 'en',
      content_types TEXT,
      monthly_backlink_target INTEGER DEFAULT 50,
      daily_action_limit INTEGER DEFAULT 15,
      max_registrations_per_day INTEGER DEFAULT 5,
      link_quality_requirements TEXT,
      preferred_categories TEXT,
      excluded_categories TEXT,
      raw_ai_instructions TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS target_websites (
      id TEXT PRIMARY KEY,
      campaign_id TEXT,
      website_url TEXT NOT NULL,
      normalized_domain TEXT NOT NULL,
      website_name TEXT,
      category TEXT,
      registration_url TEXT,
      login_url TEXT,
      target_landing_page TEXT,
      preferred_anchor TEXT,
      notes TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending_assessment',
      domain_authority INTEGER DEFAULT 50,
      spam_score INTEGER DEFAULT 2,
      ssrf_checked INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS spreadsheet_imports (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      total_rows INTEGER DEFAULT 0,
      valid_rows INTEGER DEFAULT 0,
      duplicate_rows INTEGER DEFAULT 0,
      invalid_rows INTEGER DEFAULT 0,
      column_mappings TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS imported_spreadsheet_rows (
      id TEXT PRIMARY KEY,
      import_id TEXT NOT NULL,
      target_website_id TEXT,
      raw_data TEXT NOT NULL,
      row_index INTEGER NOT NULL,
      status TEXT DEFAULT 'imported',
      FOREIGN KEY (import_id) REFERENCES spreadsheet_imports(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS website_assessments (
      id TEXT PRIMARY KEY,
      target_website_id TEXT NOT NULL,
      is_accessible INTEGER DEFAULT 1,
      http_status INTEGER DEFAULT 200,
      detected_niche TEXT,
      detected_content_types TEXT,
      publishing_opportunities TEXT,
      requires_registration INTEGER DEFAULT 0,
      permits_backlinks INTEGER DEFAULT 1,
      link_attributes TEXT,
      topical_relevance_score INTEGER DEFAULT 80,
      seo_value_score INTEGER DEFAULT 75,
      evidence_text TEXT,
      classification TEXT DEFAULT 'eligible',
      created_at TEXT NOT NULL,
      FOREIGN KEY (target_website_id) REFERENCES target_websites(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_accounts (
      id TEXT PRIMARY KEY,
      target_website_id TEXT,
      domain TEXT NOT NULL,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      encrypted_password TEXT NOT NULL,
      registration_url TEXT,
      login_url TEXT,
      account_status TEXT DEFAULT 'registered',
      last_login_at TEXT,
      session_cookie_encrypted TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS browser_sessions (
      id TEXT PRIMARY KEY,
      target_website_id TEXT,
      worker_id TEXT NOT NULL,
      session_status TEXT DEFAULT 'active',
      last_page_url TEXT,
      last_screenshot_path TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS content_drafts (
      id TEXT PRIMARY KEY,
      campaign_id TEXT,
      target_website_id TEXT,
      content_type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      target_url TEXT NOT NULL,
      anchor_text TEXT NOT NULL,
      intended_placement TEXT,
      status TEXT DEFAULT 'draft',
      relevance_score INTEGER DEFAULT 85,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS publishing_jobs (
      id TEXT PRIMARY KEY,
      campaign_id TEXT,
      target_website_id TEXT NOT NULL,
      content_draft_id TEXT,
      automation_mode TEXT DEFAULT 'maximum_safe',
      submission_url TEXT,
      live_published_url TEXT,
      job_status TEXT DEFAULT 'queued',
      retry_count INTEGER DEFAULT 0,
      max_retries INTEGER DEFAULT 3,
      last_error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS backlinks (
      id TEXT PRIMARY KEY,
      campaign_id TEXT,
      target_website_id TEXT,
      publishing_job_id TEXT,
      source_website TEXT NOT NULL,
      source_page_url TEXT NOT NULL,
      target_landing_page TEXT NOT NULL,
      anchor_text TEXT NOT NULL,
      link_attribute TEXT DEFAULT 'dofollow',
      http_status INTEGER DEFAULT 200,
      first_discovered_date TEXT NOT NULL,
      last_checked_date TEXT NOT NULL,
      verification_status TEXT DEFAULT 'verified',
      quality_assessment TEXT,
      quality_score INTEGER DEFAULT 85,
      evidence_text TEXT,
      next_action TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS verification_results (
      id TEXT PRIMARY KEY,
      backlink_id TEXT NOT NULL,
      checked_at TEXT NOT NULL,
      http_status INTEGER DEFAULT 200,
      link_found INTEGER DEFAULT 1,
      extracted_anchor TEXT,
      extracted_rel TEXT,
      extracted_target TEXT,
      page_title TEXT,
      notes TEXT,
      FOREIGN KEY (backlink_id) REFERENCES backlinks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS task_queues (
      id TEXT PRIMARY KEY,
      campaign_id TEXT,
      target_website_id TEXT,
      task_type TEXT NOT NULL,
      priority INTEGER DEFAULT 1,
      status TEXT DEFAULT 'pending',
      attempts INTEGER DEFAULT 0,
      max_attempts INTEGER DEFAULT 3,
      scheduled_at TEXT NOT NULL,
      last_attempt_at TEXT,
      error_message TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS human_approvals (
      id TEXT PRIMARY KEY,
      campaign_id TEXT,
      target_website_id TEXT,
      approval_type TEXT NOT NULL,
      title TEXT NOT NULL,
      instructions TEXT NOT NULL,
      target_url TEXT,
      status TEXT DEFAULT 'pending',
      payload_data TEXT,
      created_at TEXT NOT NULL,
      resolved_at TEXT
    );

    CREATE TABLE IF NOT EXISTS automation_settings (
      id TEXT PRIMARY KEY,
      mode TEXT DEFAULT 'maximum_safe_automation',
      daily_task_limit INTEGER DEFAULT 15,
      monthly_backlink_target INTEGER DEFAULT 50,
      concurrent_browser_workers INTEGER DEFAULT 2,
      retry_limit INTEGER DEFAULT 3,
      per_domain_cooldown_hours INTEGER DEFAULT 72,
      duplicate_prevention INTEGER DEFAULT 1,
      require_editorial_approval INTEGER DEFAULT 1,
      enforce_spam_threshold INTEGER DEFAULT 1,
      max_allowed_spam_score INTEGER DEFAULT 25,
      min_domain_authority INTEGER DEFAULT 40,
      sender_name TEXT DEFAULT 'Raza',
      sender_email TEXT DEFAULT 'an3710828@gmail.com',
      sender_company TEXT DEFAULT 'Afimah Clothing Store',
      compliance_footer TEXT,
      api_keys_encrypted TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      campaign_id TEXT,
      action TEXT NOT NULL,
      category TEXT NOT NULL,
      severity TEXT DEFAULT 'info',
      details TEXT NOT NULL,
      metadata_json TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      link TEXT,
      created_at TEXT NOT NULL
    );
  `)
}

function seedInitialDataIfNeeded(db: DatabaseSync) {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM campaigns')
  const result = countStmt.get() as { count: number }

  if (result.count === 0) {
    const now = new Date().toISOString()
    
    // Seed default master campaign
    db.prepare(`
      INSERT INTO campaigns (
        id, name, website_url, description, niche,
        target_countries, target_audience, primary_keywords, secondary_keywords,
        target_landing_pages, preferred_anchors, brand_voice, seo_objectives,
        content_language, content_types, monthly_backlink_target, daily_action_limit,
        max_registrations_per_day, link_quality_requirements, preferred_categories,
        excluded_categories, raw_ai_instructions, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'camp_master_default',
      'Afimah Clothing Q4 Global Fashion Expansion',
      'https://www.afimahclothingstore.com',
      'Premium direct-to-consumer sustainable apparel, luxury streetwear, bespoke tailoring, and contemporary modest fashion.',
      'Fashion, Apparel & Luxury Retail',
      JSON.stringify(['United States', 'United Kingdom', 'Canada', 'Pakistan', 'UAE']),
      'Fashion enthusiasts, conscious shoppers aged 22-45 seeking premium fabric craftsmanship and modern aesthetic cuts.',
      JSON.stringify(['luxury modest fashion', 'sustainable apparel brand', 'bespoke streetwear', 'afimah clothing store']),
      JSON.stringify(['contemporary luxury dresses', 'ethical apparel manufacturing', 'designer ready to wear']),
      JSON.stringify(['https://www.afimahclothingstore.com', 'https://www.afimahclothingstore.com/collections/autumn-luxury']),
      JSON.stringify(['Afimah Clothing Store', 'luxury sustainable apparel', 'designer streetwear collection', 'Afimah fashion house']),
      'Sophisticated, editorial, authoritative, polite, and trend-conscious.',
      'Build high-DA contextual backlinks on relevant fashion magazines, luxury retail directories, and apparel publications.',
      'en',
      JSON.stringify(['articles', 'business_profiles', 'directory_listings', 'guest_posts', 'community_contributions']),
      50,
      15,
      5,
      'Domain Authority >= 40, Spam Score <= 10%, legitimate contextual editorial links only.',
      JSON.stringify(['Fashion & Apparel', 'Lifestyle & Culture', 'Sustainable Living', 'E-Commerce Retail']),
      JSON.stringify(['Gambling', 'Adult', 'Pharma', 'Cryptocurrency']),
      'Focus on establishing Afimah as an international luxury and modest apparel powerhouse. Prioritize sustainable textiles and design craftsmanship.',
      'active',
      now,
      now
    )

    // Seed default automation settings
    db.prepare(`
      INSERT INTO automation_settings (
        id, mode, daily_task_limit, monthly_backlink_target, concurrent_browser_workers,
        retry_limit, per_domain_cooldown_hours, duplicate_prevention, require_editorial_approval,
        enforce_spam_threshold, max_allowed_spam_score, min_domain_authority,
        sender_name, sender_email, sender_company, compliance_footer, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'settings_default',
      'maximum_safe_automation',
      15,
      50,
      2,
      3,
      72,
      1,
      1,
      1,
      25,
      40,
      'Raza',
      'an3710828@gmail.com',
      'Afimah Clothing Store',
      'Sent with pride by Afimah Clothing Store Digital Outreach Team. Reply STOP to opt out.',
      now
    )

    // Seed initial verified targets & website inventory
    const sampleTargets = [
      {
        id: 'tgt_1',
        url: 'https://apparelresources.com',
        domain: 'apparelresources.com',
        name: 'Apparel Resources International',
        category: 'Fashion & Apparel',
        regUrl: 'https://apparelresources.com/register',
        loginUrl: 'https://apparelresources.com/login',
        anchor: 'sustainable apparel brand',
        da: 74,
        spam: 1,
        status: 'eligible',
      },
      {
        id: 'tgt_2',
        url: 'https://fashionunited.com',
        domain: 'fashionunited.com',
        name: 'FashionUnited Global Network',
        category: 'Fashion Business & News',
        regUrl: 'https://fashionunited.com/join',
        loginUrl: 'https://fashionunited.com/login',
        anchor: 'Afimah Clothing Store',
        da: 82,
        spam: 2,
        status: 'eligible',
      },
      {
        id: 'tgt_3',
        url: 'https://theformalclub.in',
        domain: 'theformalclub.in',
        name: 'The Formal Club Editorial',
        category: 'Apparel & Menswear',
        regUrl: 'https://theformalclub.in/account/register',
        loginUrl: 'https://theformalclub.in/account/login',
        anchor: 'bespoke streetwear & apparel',
        da: 61,
        spam: 1,
        status: 'eligible',
      },
      {
        id: 'tgt_4',
        url: 'https://textileindustry.net',
        domain: 'textileindustry.net',
        name: 'Textile Industry Journal',
        category: 'Manufacturing & Textiles',
        regUrl: 'https://textileindustry.net/register',
        loginUrl: 'https://textileindustry.net/login',
        anchor: 'ethical apparel manufacturing',
        da: 58,
        spam: 3,
        status: 'eligible',
      },
      {
        id: 'tgt_5',
        url: 'https://londonfashiondirectory.co.uk',
        domain: 'londonfashiondirectory.co.uk',
        name: 'London Fashion Directory',
        category: 'Business Directory',
        regUrl: 'https://londonfashiondirectory.co.uk/submit-listing',
        loginUrl: 'https://londonfashiondirectory.co.uk/login',
        anchor: 'contemporary luxury dresses',
        da: 65,
        spam: 2,
        status: 'completed',
      },
    ]

    const insertTargetStmt = db.prepare(`
      INSERT INTO target_websites (
        id, campaign_id, website_url, normalized_domain, website_name,
        category, registration_url, login_url, target_landing_page,
        preferred_anchor, notes, priority, status, domain_authority,
        spam_score, ssrf_checked, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    sampleTargets.forEach((t) => {
      insertTargetStmt.run(
        t.id,
        'camp_master_default',
        t.url,
        t.domain,
        t.name,
        t.category,
        t.regUrl,
        t.loginUrl,
        'https://www.afimahclothingstore.com',
        t.anchor,
        'High-authority verified fashion target',
        'high',
        t.status,
        t.da,
        t.spam,
        1,
        now,
        now
      )

      // Add assessment
      db.prepare(`
        INSERT INTO website_assessments (
          id, target_website_id, is_accessible, http_status, detected_niche,
          detected_content_types, publishing_opportunities, requires_registration,
          permits_backlinks, link_attributes, topical_relevance_score, seo_value_score,
          evidence_text, classification, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `assess_${t.id}`,
        t.id,
        1,
        200,
        t.category,
        JSON.stringify(['articles', 'editorial', 'directory']),
        JSON.stringify(['guest_post', 'directory_submission', 'business_profile']),
        1,
        1,
        JSON.stringify(['dofollow']),
        88,
        t.da,
        `Verified legitimate publishing portal on ${t.domain}. Public registration is accessible, and editorial links with dofollow attributes are accepted for verified apparel entities.`,
        'eligible',
        now
      )
    })

    // Seed sample verified backlinks
    db.prepare(`
      INSERT INTO backlinks (
        id, campaign_id, target_website_id, publishing_job_id,
        source_website, source_page_url, target_landing_page, anchor_text,
        link_attribute, http_status, first_discovered_date, last_checked_date,
        verification_status, quality_assessment, quality_score, evidence_text,
        next_action, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'bl_1',
      'camp_master_default',
      'tgt_5',
      'job_seed_1',
      'globalfashionnetwork.com',
      'http://localhost:3000/published/afimah-clothing-store',
      'https://www.afimahclothingstore.com',
      'sustainable luxury apparel',
      'dofollow',
      200,
      now,
      now,
      'verified',
      'High-quality editorial backlink pointing to primary brand URL with anchor "sustainable luxury apparel". Dofollow attribute confirmed.',
      94,
      '<a href="https://www.afimahclothingstore.com" rel="dofollow">sustainable luxury apparel</a> verified live in DOM with HTTP 200.',
      'Schedule 30-day link health recrawl',
      now,
      now
    )

    // Seed sample audit log
    db.prepare(`
      INSERT INTO audit_logs (id, campaign_id, action, category, severity, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'log_init',
      'camp_master_default',
      'RankWave Engine Initialized',
      'system',
      'success',
      'Persistent SQLite database schema mounted. Master campaign "Afimah Clothing Q4 Global Fashion Expansion" loaded.',
      now
    )
  }
}
