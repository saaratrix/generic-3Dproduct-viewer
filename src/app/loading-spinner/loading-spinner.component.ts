import {Component, OnInit, Input} from "@angular/core";
import {ProductConfigurationEvent, ProductConfiguratorService} from "../product-configurator.service";

@Component({
  selector: "app-loading-spinner",
  templateUrl: "./loading-spinner.component.html",
  styleUrls: ["./loading-spinner.component.scss"]
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() productConfiguratorService: ProductConfiguratorService
  loadingProgress;

  constructor() {
  }

  ngOnInit() {
    this.productConfiguratorService.getSubject(ProductConfigurationEvent.Loading_Progress).subscribe(
      (data: any) => {
        console.log("Loading_Progress", data, "%");
        this.loadingProgress = `${data}%`;
      }
    );
  }

}
