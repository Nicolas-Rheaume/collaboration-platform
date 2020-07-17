import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
	selector: 'app-content-editor-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.scss'],
})
export class ContentEditorOverviewComponent implements OnInit {
	constructor(private socket: SocketService, private cs: ContentService) {}

	ngOnInit() {}

	createCorpus() {
		this.socket.request('editor/createCorpus', null);
	}

	corpusDescriptionChange() {
		this.socket.request('editor/updateCorpusDescription', this.cs.editorCorpus.description);
	}

	createDocument() {
		this.socket.request('editor/createDocument', null);
	}

	documentTitleChange(index: number) {
		this.socket.request('editor/updateDocumentTitle', [index, this.cs.editorCorpus.documents[index].title]);
	}

	documentDescriptionChange(index: number) {
		this.socket.request('editor/updateDocumentDescription', [index, this.cs.editorCorpus.documents[index].description]);
	}

	editDocument(index: number) {
		this.cs.editingDocumentIndex = index;
		this.cs.selectedEditorState.setValue(1);
		this.socket.request('editor/getDocument', index);
	}
}
