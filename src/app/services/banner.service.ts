import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { Banner } from "../models/banner.interface";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BannerService extends BaseService { 
    private readonly _endpoint = 'banners';

    getBanners(): Observable<Banner[]> {
        return this.get(this._endpoint);
    }
}