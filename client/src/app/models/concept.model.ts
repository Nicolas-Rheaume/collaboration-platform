import { Corpus } from './corpus.model';

export enum ConceptSort {
	A_Z = 'A - Z',
	Z_A = 'Z - A',
	OLDEST = 'Oldest',
	NEWEST = 'Newest',
	MOST_CONTRIBUTOR = 'Most Contributors',
	LEAST_CONTRIBUTOR = 'Least Contributors',
	MOST_TEXTS = 'Most Texts',
	LEAST_TEXTS = 'Least Texts',
}


export class Concept {
    
	// Variables
	public title: string;
    public url: string;
    public createdAt: Date;
    public updatedAt: Date;
    
    public corpora?: Corpus[];

	public nbContributors?: number;
	public nbDocuments?: number;
	public nbTexts?: number;

	// constructor
	constructor(
        title: string = '', 
        url: string = '', 
        corpora: Corpus[] = [],
        contributors: number = 0, 
        documents: number = 0, 
        texts: number = 0, 
        createdAt: Date = null, 
        updatedAt: Date = null
    ) {
		this.title = title;
        this.url = url;
        this.corpora = corpora;
		this.nbContributors = contributors;
		this.nbDocuments = documents;
		this.nbTexts = texts;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
    }
}