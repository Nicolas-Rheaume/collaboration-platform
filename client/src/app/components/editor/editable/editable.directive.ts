/*
// First version based on https://stackoverflow.com/a/41253897/6813271
import {
  Directive, ElementRef, Input, Output, EventEmitter, SimpleChanges, OnChanges,
  HostListener, Sanitizer, SecurityContext
} from '@angular/core';

@Directive({
  selector: '[contenteditableModel]'
})
export class ContenteditableDirective implements OnChanges {

  @Input() contenteditableModel: string;
  @Output() contenteditableModelChange?= new EventEmitter();
  @Input() contenteditableHtml?: boolean = false;

  constructor(
    private elRef: ElementRef,
    private sanitizer: Sanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contenteditableModel']) {
      // On init: if contenteditableModel is empty, read from DOM in case the element has content
      if (changes['contenteditableModel'].isFirstChange() && !this.contenteditableModel) {
        this.onInput(true);
      }
      this.refreshView();
    }

    console.log("asd");
  }

  @HostListener('input') // input event would be sufficient, but isn't supported by IE
  @HostListener('blur')  // additional fallback
  @HostListener('keyup') onInput(trim = false) {
    let value = this.elRef.nativeElement[this.getProperty()];
    if (trim) {
      value = value.replace(/^[\n\s]+/, '');
      value = value.replace(/[\n\s]+$/, '');
    }
    this.contenteditableModelChange.emit(value);
  }

  @HostListener('paste') onPaste() {
    this.onInput();
    if (!this.contenteditableHtml) {
      // For text-only contenteditable, remove pasted HTML.
      // 1 tick wait is required for DOM update
      setTimeout(() => {
        if (this.elRef.nativeElement.innerHTML !== this.elRef.nativeElement.innerText) {
          this.elRef.nativeElement.innerHTML = this.elRef.nativeElement.innerText;
        }
      });
    }
  }

  private refreshView() {
    const newContent = this.sanitize(this.contenteditableModel);
    // Only refresh if content changed to avoid cursor loss
    // (as ngOnChanges can be triggered an additional time by onInput())
    if (newContent !== this.elRef.nativeElement[this.getProperty()]) {
      this.elRef.nativeElement[this.getProperty()] = newContent;
    }
  }

  private getProperty(): string {
    return this.contenteditableHtml ? 'innerHTML' : 'innerText';
  }

  private sanitize(content: string): string {
    return this.contenteditableHtml ? this.sanitizer.sanitize(SecurityContext.HTML, content) : content;
  }
}
*/

import { Directive, ElementRef, Renderer2, HostListener, forwardRef, Input, OnInit, HostBinding } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
	selector: '[contenteditable]',
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ContenteditableDirective), multi: true }],
})
export class ContenteditableDirective implements ControlValueAccessor {
	@HostBinding('attr.contenteditable') enabled = true;

	private onChange: (value: string) => void;
	private onTouched: () => void;
	private removeDisabledState: () => void;

	constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

	@HostListener('input') onInput(): void {
		this.onChange(this.elementRef.nativeElement.innerHTML);

		console.log(this.elementRef.nativeElement.innerHTML);
	}

	@HostListener('blur') onBlur(): void {
		this.onTouched();
	}

	writeValue(value: string): void {
		this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', value || '');
	}

	registerOnChange(onChange: (value: string) => void): void {
		this.onChange = onChange;
	}

	registerOnTouched(onTouched: () => void): void {
		this.onTouched = onTouched;
	}

	setDisabledState(disabled: boolean): void {
		this.enabled = !disabled;
	}
}

/*
// First version based on https://stackoverflow.com/a/41253897/6813271
import {
    Directive, ElementRef, Input, Output, EventEmitter, SimpleChanges, OnChanges,
    HostListener, Sanitizer, SecurityContext
  } from '@angular/core';
  
  @Directive({
    selector: '[contenteditableModel]',
    host: {
		'(blur)': 'onBlur()'
	}
  })
  export class ContenteditableDirective implements OnChanges {

    @Input() contenteditableModel: string;
    @Output() contenteditableModelChange?= new EventEmitter();

    @Input() contenteditableHtml?: boolean = false;
    private lastViewModel: any;
  
    constructor(
      private elRef: ElementRef,
      private sanitizer: Sanitizer
    ) { }

    ngOnChanges(changes: SimpleChanges) {

  }
  */

/*
    ngOnChanges(changes: SimpleChanges) {
		if (changes['contenteditableModel']) {
            // On init: if contenteditableModel is empty, read from DOM in case the element has content
            if (changes['contenteditableModel'].isFirstChange() && !this.contenteditableModel) {
              this.onInput(true);
            }
            this.refreshView();
          }
	}

	onBlur() {
		var value = this.elRef.nativeElement.innerText
		this.lastViewModel = value
		this.contenteditableModelChange.emit(value)
	}

	private refreshView() {
		this.elRef.nativeElement.innerText = this.contenteditableModel;
    }
    */

/*
    ngOnChanges(changes: SimpleChanges) {
      if (changes['contenteditableModel']) {
        // On init: if contenteditableModel is empty, read from DOM in case the element has content
        if (changes['contenteditableModel'].isFirstChange() && !this.contenteditableModel) {
          this.onInput(true);
        }
        this.refreshView();
      }
    }
  
    @HostListener('input') // input event would be sufficient, but isn't supported by IE
    @HostListener('blur')  // additional fallback
    @HostListener('keyup') onInput(trim = false) {
      let value = this.elRef.nativeElement[this.getProperty()];
      if (trim) {
        value = value.replace(/^[\n\s]+/, '');
        value = value.replace(/[\n\s]+$/, '');
      }
      this.contenteditableModelChange.emit(value);
    }
  
    @HostListener('paste') onPaste() {
      this.onInput();
      if (!this.contenteditableHtml) {
        // For text-only contenteditable, remove pasted HTML.
        // 1 tick wait is required for DOM update
        setTimeout(() => {
          if (this.elRef.nativeElement.innerHTML !== this.elRef.nativeElement.innerText) {
            this.elRef.nativeElement.innerHTML = this.elRef.nativeElement.innerText;
          }
        });
      }
    }
  
    private refreshView() {
      const newContent = this.sanitize(this.contenteditableModel);
      // Only refresh if content changed to avoid cursor loss
      // (as ngOnChanges can be triggered an additional time by onInput())
      if (newContent !== this.elRef.nativeElement[this.getProperty()]) {
        this.elRef.nativeElement[this.getProperty()] = newContent;
      }
    }
  
    private getProperty(): string {
      return this.contenteditableHtml ? 'innerHTML' : 'innerText';
    }
  
    private sanitize(content: string): string {
      return this.contenteditableHtml ? this.sanitizer.sanitize(SecurityContext.HTML, content) : content;
    }
    */
/*
  }
  */
