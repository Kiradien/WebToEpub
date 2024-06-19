"use strict";

/*parserFactory.register("wuxiaworldsite.co", () => new GenericParser("#full_list a", "i",  false, "h1.heading_read", ".read-item .img-read", ".story-introduction-content",
                                                 "a.home-story:nth-of-type(3)", ".content-story", "p[style='display: none']"));
parserFactory.register("freenovelupdates.com", () => new GenericParser(".chapters-container:nth-of-type(4) .chapters-content li a", null,  false, ".book-content .base-info h1", ".book-content .img", ".info .description-content",
                                                 ".breadcrumb span:nth-of-type(5)", ".chapter-content .content", null));*/
parserFactory.register("wuxiaworld.com", () => new GenericParser("#novel-tabs div.h-full:nth-of-type(2) a", null,  true, "div.bg-gray-100 h1", "head meta[name~='twitter:image']", "#novel-tabs div.h-full:nth-of-type(1) div.fr-view:nth-of-type(1)",
                                                 "div.flex-1 div.font-set-sb16 span", "div.chapter-content div.fr-view", null));
                                                 //chaptertitleselector broken? No, need separate inpage logic for restrictions

class GenericParser extends Parser{
    constructor(chapterSelector, chapterTitleTextRemovalSelector, chapterIsReversed, titleSelector, coverImageSelector, descriptionSelector, 
            chapterTitleSelector, chapterContentSelector, chapterTextRemovalSelector) {
        super();
        this.chapterSelector = chapterSelector;
        this.chapterTitleTextRemovalSelector = chapterTitleTextRemovalSelector;
        this.chapterIsReversed = chapterIsReversed;
        this.titleSelector = titleSelector;
        this.coverImageSelector = coverImageSelector;
        this.descriptionSelector = descriptionSelector;
        this.chapterTitleSelector = chapterTitleSelector;
        this.chapterContentSelector = chapterContentSelector;
        this.chapterTextRemovalSelector = chapterTextRemovalSelector;
    }

    async getChapterUrls(dom) {
        let returnValue = [...dom.querySelectorAll(this.chapterSelector)].map(a => this.hyperLinkToChapter(a));
        if (this.chapterIsReversed)
        {
            returnValue = returnValue.reverse();
        }
        return returnValue;
    }

    findContent(dom) {
        var retval = dom.querySelector(this.chapterContentSelector);
        
        [...retval.querySelectorAll(this.chapterTextRemovalSelector)].forEach(item => item.remove());

        return retval;
    }

    extractTitleImpl(dom) {
        if (this.titleSelector == null)
        {
            return super.extractTitleImpl(dom);
        }
        return dom.querySelector(this.titleSelector);
    }

    findChapterTitle(dom) {
        console.log(`Finding Chapter: ${this.chapterTitleSelector}`);
        if (this.chapterTitleSelector == null)
        {
            return super.findChapterTitle(dom);
        }
        return dom.querySelector(this.chapterTitleSelector);
    }

    findCoverImageUrl(dom) {
        if (this.coverImageSelector == null)
        {
            return super.findCoverImageUrl(dom);
        }
        let content = dom.querySelector(this.coverImageSelector);
        if (content.tagName =='META')
        {
            return content.content;
        }

        return util.getFirstImgSrc(dom, this.coverImageSelector);
    }



    hyperLinkToChapter(link, newArc) {
        if (!!this.chapterTitleTextRemovalSelector)
        {
            link.querySelector(this.chapterTitleTextRemovalSelector).remove();
        }

        return util.hyperLinkToChapter(link, newArc);
    }
}
