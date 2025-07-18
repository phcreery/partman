/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	ComponentCategories = "component_categories",
	ComponentLog = "component_log",
	Components = "components",
	Config = "config",
	FootprintCategories = "footprint_categories",
	Footprints = "footprints",
	Manufacturers = "manufacturers",
	ProjectBuilds = "project_builds",
	ProjectComponents = "project_components",
	Projects = "projects",
	StorageCategories = "storage_categories",
	StorageLocations = "storage_locations",
	Suppliers = "suppliers",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type ComponentCategoriesRecord = {
	created?: IsoDateString
	description?: string
	id: string
	name: string
	parent?: RecordIdString
	updated?: IsoDateString
}

export type ComponentLogRecord<Tnew_value = unknown, Told_value = unknown> = {
	component?: string
	created?: IsoDateString
	description?: string
	id: string
	new_value?: null | Tnew_value
	old_value?: null | Told_value
	updated?: IsoDateString
}

export type ComponentsRecord<Tspecs = unknown> = {
	category?: RecordIdString
	comment?: string
	created?: IsoDateString
	description?: string
	footprint?: RecordIdString
	id: string
	image?: string
	ipn?: string
	manufacturer?: string
	mpn: string
	specs?: null | Tspecs
	spn?: string
	stock?: number
	storage_location?: RecordIdString
	supplier?: RecordIdString[]
	updated?: IsoDateString
}

export type ConfigRecord<Tvalue = unknown> = {
	category: string
	created?: IsoDateString
	id: string
	updated?: IsoDateString
	value?: null | Tvalue
}

export type FootprintCategoriesRecord = {
	created?: IsoDateString
	description?: string
	id: string
	name: string
	parent?: RecordIdString
	updated?: IsoDateString
}

export type FootprintsRecord = {
	category?: RecordIdString
	created?: IsoDateString
	description?: string
	id: string
	name: string
	updated?: IsoDateString
}

export type ManufacturersRecord = {
	created?: IsoDateString
	id: string
	name: string
	updated?: IsoDateString
	url?: string
}

export type ProjectBuildsRecord = {
	comment?: string
	created?: IsoDateString
	id: string
	project: RecordIdString
	qty?: number
	updated?: IsoDateString
}

export type ProjectComponentsRecord = {
	bom_id: string
	comment?: string
	component?: RecordIdString
	created?: IsoDateString
	id: string
	quantity?: number
	refdesignators?: string
	updated?: IsoDateString
}

export type ProjectsRecord = {
	components?: RecordIdString[]
	created?: IsoDateString
	description?: string
	id: string
	name: string
	updated?: IsoDateString
}

export type StorageCategoriesRecord = {
	created?: IsoDateString
	desciption?: string
	id: string
	name: string
	parent?: RecordIdString
	updated?: IsoDateString
}

export type StorageLocationsRecord = {
	category?: RecordIdString
	created?: IsoDateString
	description?: string
	id: string
	name: string
	updated?: IsoDateString
}

export type SuppliersRecord = {
	created?: IsoDateString
	id: string
	name: string
	updated?: IsoDateString
	url?: string
}

export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email?: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	username: string
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type ComponentCategoriesResponse<Texpand = unknown> = Required<ComponentCategoriesRecord> & BaseSystemFields<Texpand>
export type ComponentLogResponse<Tnew_value = unknown, Told_value = unknown, Texpand = unknown> = Required<ComponentLogRecord<Tnew_value, Told_value>> & BaseSystemFields<Texpand>
export type ComponentsResponse<Tspecs = unknown, Texpand = unknown> = Required<ComponentsRecord<Tspecs>> & BaseSystemFields<Texpand>
export type ConfigResponse<Tvalue = unknown, Texpand = unknown> = Required<ConfigRecord<Tvalue>> & BaseSystemFields<Texpand>
export type FootprintCategoriesResponse<Texpand = unknown> = Required<FootprintCategoriesRecord> & BaseSystemFields<Texpand>
export type FootprintsResponse<Texpand = unknown> = Required<FootprintsRecord> & BaseSystemFields<Texpand>
export type ManufacturersResponse<Texpand = unknown> = Required<ManufacturersRecord> & BaseSystemFields<Texpand>
export type ProjectBuildsResponse<Texpand = unknown> = Required<ProjectBuildsRecord> & BaseSystemFields<Texpand>
export type ProjectComponentsResponse<Texpand = unknown> = Required<ProjectComponentsRecord> & BaseSystemFields<Texpand>
export type ProjectsResponse<Texpand = unknown> = Required<ProjectsRecord> & BaseSystemFields<Texpand>
export type StorageCategoriesResponse<Texpand = unknown> = Required<StorageCategoriesRecord> & BaseSystemFields<Texpand>
export type StorageLocationsResponse<Texpand = unknown> = Required<StorageLocationsRecord> & BaseSystemFields<Texpand>
export type SuppliersResponse<Texpand = unknown> = Required<SuppliersRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	component_categories: ComponentCategoriesRecord
	component_log: ComponentLogRecord
	components: ComponentsRecord
	config: ConfigRecord
	footprint_categories: FootprintCategoriesRecord
	footprints: FootprintsRecord
	manufacturers: ManufacturersRecord
	project_builds: ProjectBuildsRecord
	project_components: ProjectComponentsRecord
	projects: ProjectsRecord
	storage_categories: StorageCategoriesRecord
	storage_locations: StorageLocationsRecord
	suppliers: SuppliersRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	component_categories: ComponentCategoriesResponse
	component_log: ComponentLogResponse
	components: ComponentsResponse
	config: ConfigResponse
	footprint_categories: FootprintCategoriesResponse
	footprints: FootprintsResponse
	manufacturers: ManufacturersResponse
	project_builds: ProjectBuildsResponse
	project_components: ProjectComponentsResponse
	projects: ProjectsResponse
	storage_categories: StorageCategoriesResponse
	storage_locations: StorageLocationsResponse
	suppliers: SuppliersResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'component_categories'): RecordService<ComponentCategoriesResponse>
	collection(idOrName: 'component_log'): RecordService<ComponentLogResponse>
	collection(idOrName: 'components'): RecordService<ComponentsResponse>
	collection(idOrName: 'config'): RecordService<ConfigResponse>
	collection(idOrName: 'footprint_categories'): RecordService<FootprintCategoriesResponse>
	collection(idOrName: 'footprints'): RecordService<FootprintsResponse>
	collection(idOrName: 'manufacturers'): RecordService<ManufacturersResponse>
	collection(idOrName: 'project_builds'): RecordService<ProjectBuildsResponse>
	collection(idOrName: 'project_components'): RecordService<ProjectComponentsResponse>
	collection(idOrName: 'projects'): RecordService<ProjectsResponse>
	collection(idOrName: 'storage_categories'): RecordService<StorageCategoriesResponse>
	collection(idOrName: 'storage_locations'): RecordService<StorageLocationsResponse>
	collection(idOrName: 'suppliers'): RecordService<SuppliersResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
