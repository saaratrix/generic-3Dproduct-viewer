import { Color, DirectionalLight, Light, PerspectiveCamera, Scene, WebGLRenderer, } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductChanger } from "./ProductChanger";
import { MaterialTextureChanger } from "./material-animators/MaterialTextureChanger";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PointerEventHandler } from "./PointerEventHandler";
import { SelectedProductHighlighter } from "./SelectedProductHighlighter";
import { SelectedProductMeshIntersector } from "./SelectedProductMeshIntersector";
import { MaterialColorChanger } from "./material-animators/MaterialColorChanger";

@Injectable({
  providedIn: "root"
})
export class ProductConfigurator {
  public productConfiguratorService: ProductConfiguratorService;
  public activatedRouter: ActivatedRoute;
  public router: Router;

  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public cameraControls: OrbitControls;

  public lights: Light[] = [];

  public lightIntensityFactor: number = 1;

  private productChanger: ProductChanger;
  private materialColorChanger: MaterialColorChanger;
  private textureChanger: MaterialTextureChanger;
  private selectedProductMeshIntersector: SelectedProductMeshIntersector;
  private pointerEventHandler: PointerEventHandler;
  private selectedProductHighlighter: SelectedProductHighlighter;

  constructor(
    renderer: WebGLRenderer,
    productConfiguratorService: ProductConfiguratorService,
    activatedRoute: ActivatedRoute,
    router: Router,
  ) {
    this.renderer = renderer;
    this.productConfiguratorService = productConfiguratorService;
    this.activatedRouter = activatedRoute;
    this.router = router;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(new Color(0x444444));

    this.scene = new Scene();

    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(90, aspectRatio, 0.1, 10000);
    this.camera.position.z = 100;

    this.scene.add(this.camera);

    this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.cameraControls.maxPolarAngle = Math.PI;
    this.cameraControls.minPolarAngle = 0;
    this.cameraControls.enablePan = false;
    this.cameraControls.enableDamping = true;
    this.cameraControls.dampingFactor = 0.05;
    this.cameraControls.rotateSpeed *= 0.67;
    this.cameraControls.update();

    this.initLights();

    this.productChanger = new ProductChanger(this);
    this.materialColorChanger = new MaterialColorChanger(this.productConfiguratorService);
    this.textureChanger = new MaterialTextureChanger(this.productConfiguratorService);
    this.selectedProductMeshIntersector = new SelectedProductMeshIntersector(this.camera, this.productConfiguratorService);
    this.pointerEventHandler = new PointerEventHandler(this.productConfiguratorService, this.selectedProductMeshIntersector);
    this.selectedProductHighlighter = new SelectedProductHighlighter(this.renderer, this.productConfiguratorService);

    this.pointerEventHandler.initPointerEvents(this.renderer.domElement);
    this.initEvents();

    this.startRenderLoop();
  }

  public startRenderLoop(): void {
    const renderFunction = (): void => {
      this.cameraControls.update();

      this.renderer.render(this.scene, this.camera);
      this.selectedProductHighlighter.renderOutline(this.scene, this.camera);

      requestAnimationFrame(renderFunction);
    };

    requestAnimationFrame(renderFunction);
  }

  public initLights(): void {
    // UE4 said ~285, set up 3 lights using UE4 to easier visualize direction.
    const height = 285;

    const intensity = 0.7;
    const fillIntensity = intensity / 2;
    const backIntensity = intensity / 4;

    const gammaSpaceIntensity = 0.3;
    this.lightIntensityFactor = intensity / gammaSpaceIntensity;

    const keyLight = new DirectionalLight(0xFFFFFF, intensity);
    keyLight.position.set(-247, height, 209);
    keyLight.position.normalize();
    keyLight.castShadow = true;

    const fillLight = new DirectionalLight(0xFFFFFF, fillIntensity);
    fillLight.position.set(212, height, 250);
    fillLight.position.normalize();
    fillLight.castShadow = true;

    const backLight = new DirectionalLight(0xFFFFFF, backIntensity);
    backLight.position.set(-153, height, -183);
    backLight.position.normalize();
    backLight.castShadow = true;

    this.scene.add(keyLight, fillLight, backLight);
    this.lights.push(keyLight, fillLight, backLight);
  }

  /**
   * Init events like window.resize
   */
  public initEvents(): void {
    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  public loadInitialItem(): void {
    const snapshot = this.activatedRouter.snapshot;
    const name = snapshot.paramMap.has("name") ? snapshot.paramMap.get("name")!.toLowerCase() : "";
    const selectedItem = this.productConfiguratorService.items.find(i => i.name.toLowerCase() === name) || this.productConfiguratorService.items[0];
    this.productChanger.changeProduct(selectedItem);
  }
}
