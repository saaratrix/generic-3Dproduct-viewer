import { Color, DirectionalLight, Light, PerspectiveCamera, Scene, WebGLRenderer, } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductChanger } from "./ProductChanger";
import { TextureChanger } from "./TextureChanger";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ProductConfigurator {
  public productConfigurationService: ProductConfiguratorService;

  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public cameraControls: OrbitControls;

  public lights: Light[] = [];

  public lightIntensityFactor: number;

  private productChanger: ProductChanger;
  private textureChanger: TextureChanger;

  constructor(renderer: WebGLRenderer, productConfigurationService: ProductConfiguratorService) {
    this.renderer = renderer;
    this.productConfigurationService = productConfigurationService;

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
    this.cameraControls.update();

    this.initLights();

    this.productChanger = new ProductChanger(this);
    this.productChanger.changeProduct(this.productConfigurationService.items[0]);

    this.textureChanger = new TextureChanger(this.productConfigurationService);

    this.initEvents();

    this.startRenderLoop();
  }

  public startRenderLoop() {
    const renderFunction = () => {
      this.cameraControls.update();

      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(renderFunction);
    };

    requestAnimationFrame(renderFunction);
  }

  public initLights() {
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
  public initEvents() {
    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }
}
