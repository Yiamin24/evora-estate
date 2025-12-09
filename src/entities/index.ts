/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: keyhighlights
 * Interface for KeyHighlights
 */
export interface KeyHighlights {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  highlightTitle?: string;
  /** @wixFieldType image */
  highlightIcon?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType number */
  sortOrder?: number;
  /** @wixFieldType text */
  category?: string;
}


/**
 * Collection ID: lifestylegallery
 * Interface for LifestyleGallery
 */
export interface LifestyleGallery {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType image */
  image?: string;
  /** @wixFieldType text */
  imageTitle?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType number */
  sortOrder?: number;
  /** @wixFieldType text */
  altText?: string;
}


/**
 * Collection ID: locationadvantages
 * Interface for LocationAdvantages
 */
export interface LocationAdvantages {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  sectionHeadline?: string;
  /** @wixFieldType text */
  advantage1?: string;
  /** @wixFieldType text */
  advantage2?: string;
  /** @wixFieldType text */
  advantage3?: string;
  /** @wixFieldType text */
  advantage4?: string;
  /** @wixFieldType text */
  advantage5?: string;
  /** @wixFieldType image */
  mapIllustrationImage?: string;
  /** @wixFieldType image */
  locationPinOverlayImage?: string;
  /** @wixFieldType image */
  nh44HighlightOverlayImage?: string;
}


/**
 * Collection ID: projectpartners
 * Interface for ProjectPartners
 */
export interface ProjectPartners {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  partnerName?: string;
  /** @wixFieldType text */
  partnerType?: string;
  /** @wixFieldType image */
  partnerLogo?: string;
  /** @wixFieldType text */
  partnerDescription?: string;
  /** @wixFieldType url */
  websiteUrl?: string;
}


/**
 * Collection ID: projectusps
 * Interface for ProjectUSPs
 */
export interface ProjectUSPs {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  uspText?: string;
  /** @wixFieldType image */
  uspIcon?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType number */
  displayOrder?: number;
  /** @wixFieldType boolean */
  isActive?: boolean;
}
