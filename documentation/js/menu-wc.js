'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nestjs-boilerplate documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AccountSeedModule.html" data-type="entity-link" >AccountSeedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AccountSeedModule-15767320c0e9fdb8a7e166bd3aa1bc94c4cfe7081744fe8bed1bf688b1cef0c82ac389084d4a6e482ad9baa64f3763d1c359892d8f5a495b01537f544eeb2509"' : 'data-bs-target="#xs-injectables-links-module-AccountSeedModule-15767320c0e9fdb8a7e166bd3aa1bc94c4cfe7081744fe8bed1bf688b1cef0c82ac389084d4a6e482ad9baa64f3763d1c359892d8f5a495b01537f544eeb2509"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AccountSeedModule-15767320c0e9fdb8a7e166bd3aa1bc94c4cfe7081744fe8bed1bf688b1cef0c82ac389084d4a6e482ad9baa64f3763d1c359892d8f5a495b01537f544eeb2509"' :
                                        'id="xs-injectables-links-module-AccountSeedModule-15767320c0e9fdb8a7e166bd3aa1bc94c4cfe7081744fe8bed1bf688b1cef0c82ac389084d4a6e482ad9baa64f3763d1c359892d8f5a495b01537f544eeb2509"' }>
                                        <li class="link">
                                            <a href="injectables/AccountSeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountSeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AccountsModule.html" data-type="entity-link" >AccountsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AccountsModule-b72f980e44a3c3720b500622d1fad5361e37f68c08f51af6318d8ac0a5a7f8e0f06d449f8eb392a74053271a92e8d1e52f50f528b7364c6b6c6d78cd76296298"' : 'data-bs-target="#xs-controllers-links-module-AccountsModule-b72f980e44a3c3720b500622d1fad5361e37f68c08f51af6318d8ac0a5a7f8e0f06d449f8eb392a74053271a92e8d1e52f50f528b7364c6b6c6d78cd76296298"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AccountsModule-b72f980e44a3c3720b500622d1fad5361e37f68c08f51af6318d8ac0a5a7f8e0f06d449f8eb392a74053271a92e8d1e52f50f528b7364c6b6c6d78cd76296298"' :
                                            'id="xs-controllers-links-module-AccountsModule-b72f980e44a3c3720b500622d1fad5361e37f68c08f51af6318d8ac0a5a7f8e0f06d449f8eb392a74053271a92e8d1e52f50f528b7364c6b6c6d78cd76296298"' }>
                                            <li class="link">
                                                <a href="controllers/AccountsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AccountsModule-b72f980e44a3c3720b500622d1fad5361e37f68c08f51af6318d8ac0a5a7f8e0f06d449f8eb392a74053271a92e8d1e52f50f528b7364c6b6c6d78cd76296298"' : 'data-bs-target="#xs-injectables-links-module-AccountsModule-b72f980e44a3c3720b500622d1fad5361e37f68c08f51af6318d8ac0a5a7f8e0f06d449f8eb392a74053271a92e8d1e52f50f528b7364c6b6c6d78cd76296298"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AccountsModule-b72f980e44a3c3720b500622d1fad5361e37f68c08f51af6318d8ac0a5a7f8e0f06d449f8eb392a74053271a92e8d1e52f50f528b7364c6b6c6d78cd76296298"' :
                                        'id="xs-injectables-links-module-AccountsModule-b72f980e44a3c3720b500622d1fad5361e37f68c08f51af6318d8ac0a5a7f8e0f06d449f8eb392a74053271a92e8d1e52f50f528b7364c6b6c6d78cd76296298"' }>
                                        <li class="link">
                                            <a href="injectables/AccountsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthAppleModule.html" data-type="entity-link" >AuthAppleModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthAppleModule-0033b22e245998284891f7284075a9278049d2c9869288086779e52112fb19d0cfd480a294eb66ddac0f674b5e9a8c73681a58ca6bdeb60225365f5ac7e3ae8c"' : 'data-bs-target="#xs-controllers-links-module-AuthAppleModule-0033b22e245998284891f7284075a9278049d2c9869288086779e52112fb19d0cfd480a294eb66ddac0f674b5e9a8c73681a58ca6bdeb60225365f5ac7e3ae8c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthAppleModule-0033b22e245998284891f7284075a9278049d2c9869288086779e52112fb19d0cfd480a294eb66ddac0f674b5e9a8c73681a58ca6bdeb60225365f5ac7e3ae8c"' :
                                            'id="xs-controllers-links-module-AuthAppleModule-0033b22e245998284891f7284075a9278049d2c9869288086779e52112fb19d0cfd480a294eb66ddac0f674b5e9a8c73681a58ca6bdeb60225365f5ac7e3ae8c"' }>
                                            <li class="link">
                                                <a href="controllers/AuthAppleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthAppleController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthAppleModule-0033b22e245998284891f7284075a9278049d2c9869288086779e52112fb19d0cfd480a294eb66ddac0f674b5e9a8c73681a58ca6bdeb60225365f5ac7e3ae8c"' : 'data-bs-target="#xs-injectables-links-module-AuthAppleModule-0033b22e245998284891f7284075a9278049d2c9869288086779e52112fb19d0cfd480a294eb66ddac0f674b5e9a8c73681a58ca6bdeb60225365f5ac7e3ae8c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthAppleModule-0033b22e245998284891f7284075a9278049d2c9869288086779e52112fb19d0cfd480a294eb66ddac0f674b5e9a8c73681a58ca6bdeb60225365f5ac7e3ae8c"' :
                                        'id="xs-injectables-links-module-AuthAppleModule-0033b22e245998284891f7284075a9278049d2c9869288086779e52112fb19d0cfd480a294eb66ddac0f674b5e9a8c73681a58ca6bdeb60225365f5ac7e3ae8c"' }>
                                        <li class="link">
                                            <a href="injectables/AuthAppleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthAppleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthFacebookModule.html" data-type="entity-link" >AuthFacebookModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthFacebookModule-7846440ac1ad28c8f92bf537281a3085ef81b6481599c488df5c62e99b73e62fc032025d4ae02bf3c830027a6fe3838df3aa42620bbda008725ed06cdce9d023"' : 'data-bs-target="#xs-controllers-links-module-AuthFacebookModule-7846440ac1ad28c8f92bf537281a3085ef81b6481599c488df5c62e99b73e62fc032025d4ae02bf3c830027a6fe3838df3aa42620bbda008725ed06cdce9d023"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthFacebookModule-7846440ac1ad28c8f92bf537281a3085ef81b6481599c488df5c62e99b73e62fc032025d4ae02bf3c830027a6fe3838df3aa42620bbda008725ed06cdce9d023"' :
                                            'id="xs-controllers-links-module-AuthFacebookModule-7846440ac1ad28c8f92bf537281a3085ef81b6481599c488df5c62e99b73e62fc032025d4ae02bf3c830027a6fe3838df3aa42620bbda008725ed06cdce9d023"' }>
                                            <li class="link">
                                                <a href="controllers/AuthFacebookController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthFacebookController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthFacebookModule-7846440ac1ad28c8f92bf537281a3085ef81b6481599c488df5c62e99b73e62fc032025d4ae02bf3c830027a6fe3838df3aa42620bbda008725ed06cdce9d023"' : 'data-bs-target="#xs-injectables-links-module-AuthFacebookModule-7846440ac1ad28c8f92bf537281a3085ef81b6481599c488df5c62e99b73e62fc032025d4ae02bf3c830027a6fe3838df3aa42620bbda008725ed06cdce9d023"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthFacebookModule-7846440ac1ad28c8f92bf537281a3085ef81b6481599c488df5c62e99b73e62fc032025d4ae02bf3c830027a6fe3838df3aa42620bbda008725ed06cdce9d023"' :
                                        'id="xs-injectables-links-module-AuthFacebookModule-7846440ac1ad28c8f92bf537281a3085ef81b6481599c488df5c62e99b73e62fc032025d4ae02bf3c830027a6fe3838df3aa42620bbda008725ed06cdce9d023"' }>
                                        <li class="link">
                                            <a href="injectables/AuthFacebookService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthFacebookService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthGoogleModule.html" data-type="entity-link" >AuthGoogleModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthGoogleModule-0a495d1c488fcf3a6fe830bb05047956d355b3bb6ddb46fd34db2d10035a3c0df6de55f78635f910f2d6c90fa7f486a1c4d50f7b866c6df92b53120e3513036b"' : 'data-bs-target="#xs-controllers-links-module-AuthGoogleModule-0a495d1c488fcf3a6fe830bb05047956d355b3bb6ddb46fd34db2d10035a3c0df6de55f78635f910f2d6c90fa7f486a1c4d50f7b866c6df92b53120e3513036b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthGoogleModule-0a495d1c488fcf3a6fe830bb05047956d355b3bb6ddb46fd34db2d10035a3c0df6de55f78635f910f2d6c90fa7f486a1c4d50f7b866c6df92b53120e3513036b"' :
                                            'id="xs-controllers-links-module-AuthGoogleModule-0a495d1c488fcf3a6fe830bb05047956d355b3bb6ddb46fd34db2d10035a3c0df6de55f78635f910f2d6c90fa7f486a1c4d50f7b866c6df92b53120e3513036b"' }>
                                            <li class="link">
                                                <a href="controllers/AuthGoogleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthGoogleController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthGoogleModule-0a495d1c488fcf3a6fe830bb05047956d355b3bb6ddb46fd34db2d10035a3c0df6de55f78635f910f2d6c90fa7f486a1c4d50f7b866c6df92b53120e3513036b"' : 'data-bs-target="#xs-injectables-links-module-AuthGoogleModule-0a495d1c488fcf3a6fe830bb05047956d355b3bb6ddb46fd34db2d10035a3c0df6de55f78635f910f2d6c90fa7f486a1c4d50f7b866c6df92b53120e3513036b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthGoogleModule-0a495d1c488fcf3a6fe830bb05047956d355b3bb6ddb46fd34db2d10035a3c0df6de55f78635f910f2d6c90fa7f486a1c4d50f7b866c6df92b53120e3513036b"' :
                                        'id="xs-injectables-links-module-AuthGoogleModule-0a495d1c488fcf3a6fe830bb05047956d355b3bb6ddb46fd34db2d10035a3c0df6de55f78635f910f2d6c90fa7f486a1c4d50f7b866c6df92b53120e3513036b"' }>
                                        <li class="link">
                                            <a href="injectables/AuthGoogleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthGoogleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-931099b5f69b920371eb3636b88823de163fc86018f1ee7940fac7edd138d1c41e4a348b8809eed43e3493867b5a29b9725fb78ec26e5ea61ad9b7d4a8668132"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-931099b5f69b920371eb3636b88823de163fc86018f1ee7940fac7edd138d1c41e4a348b8809eed43e3493867b5a29b9725fb78ec26e5ea61ad9b7d4a8668132"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-931099b5f69b920371eb3636b88823de163fc86018f1ee7940fac7edd138d1c41e4a348b8809eed43e3493867b5a29b9725fb78ec26e5ea61ad9b7d4a8668132"' :
                                            'id="xs-controllers-links-module-AuthModule-931099b5f69b920371eb3636b88823de163fc86018f1ee7940fac7edd138d1c41e4a348b8809eed43e3493867b5a29b9725fb78ec26e5ea61ad9b7d4a8668132"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-931099b5f69b920371eb3636b88823de163fc86018f1ee7940fac7edd138d1c41e4a348b8809eed43e3493867b5a29b9725fb78ec26e5ea61ad9b7d4a8668132"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-931099b5f69b920371eb3636b88823de163fc86018f1ee7940fac7edd138d1c41e4a348b8809eed43e3493867b5a29b9725fb78ec26e5ea61ad9b7d4a8668132"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-931099b5f69b920371eb3636b88823de163fc86018f1ee7940fac7edd138d1c41e4a348b8809eed43e3493867b5a29b9725fb78ec26e5ea61ad9b7d4a8668132"' :
                                        'id="xs-injectables-links-module-AuthModule-931099b5f69b920371eb3636b88823de163fc86018f1ee7940fac7edd138d1c41e4a348b8809eed43e3493867b5a29b9725fb78ec26e5ea61ad9b7d4a8668132"' }>
                                        <li class="link">
                                            <a href="injectables/AnonymousStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnonymousStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtRefreshStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtRefreshStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DocumentFilePersistenceModule.html" data-type="entity-link" >DocumentFilePersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DocumentKycDetailsPersistenceModule.html" data-type="entity-link" >DocumentKycDetailsPersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DocumentSessionPersistenceModule.html" data-type="entity-link" >DocumentSessionPersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DocumentUserPersistenceModule.html" data-type="entity-link" >DocumentUserPersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FilesLocalModule.html" data-type="entity-link" >FilesLocalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-FilesLocalModule-9f07019a7dbec7853f06df00259be0ae92daa9d5b190e2eed1064953a831c426d70333672a145f87fbdd35fdb46d87e48abc7b62e3d5689328d3192c863392f0"' : 'data-bs-target="#xs-controllers-links-module-FilesLocalModule-9f07019a7dbec7853f06df00259be0ae92daa9d5b190e2eed1064953a831c426d70333672a145f87fbdd35fdb46d87e48abc7b62e3d5689328d3192c863392f0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FilesLocalModule-9f07019a7dbec7853f06df00259be0ae92daa9d5b190e2eed1064953a831c426d70333672a145f87fbdd35fdb46d87e48abc7b62e3d5689328d3192c863392f0"' :
                                            'id="xs-controllers-links-module-FilesLocalModule-9f07019a7dbec7853f06df00259be0ae92daa9d5b190e2eed1064953a831c426d70333672a145f87fbdd35fdb46d87e48abc7b62e3d5689328d3192c863392f0"' }>
                                            <li class="link">
                                                <a href="controllers/FilesLocalController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilesLocalController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FilesLocalModule-9f07019a7dbec7853f06df00259be0ae92daa9d5b190e2eed1064953a831c426d70333672a145f87fbdd35fdb46d87e48abc7b62e3d5689328d3192c863392f0"' : 'data-bs-target="#xs-injectables-links-module-FilesLocalModule-9f07019a7dbec7853f06df00259be0ae92daa9d5b190e2eed1064953a831c426d70333672a145f87fbdd35fdb46d87e48abc7b62e3d5689328d3192c863392f0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FilesLocalModule-9f07019a7dbec7853f06df00259be0ae92daa9d5b190e2eed1064953a831c426d70333672a145f87fbdd35fdb46d87e48abc7b62e3d5689328d3192c863392f0"' :
                                        'id="xs-injectables-links-module-FilesLocalModule-9f07019a7dbec7853f06df00259be0ae92daa9d5b190e2eed1064953a831c426d70333672a145f87fbdd35fdb46d87e48abc7b62e3d5689328d3192c863392f0"' }>
                                        <li class="link">
                                            <a href="injectables/FilesLocalService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilesLocalService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FilesModule.html" data-type="entity-link" >FilesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FilesModule-40a9d495603c13430d249b538e837f3ae2d4471bebd564133b205787b97175124332dc0f26ba10ec8a36531bc81658f8d939c0c64d315c187e42199e3d249e72"' : 'data-bs-target="#xs-injectables-links-module-FilesModule-40a9d495603c13430d249b538e837f3ae2d4471bebd564133b205787b97175124332dc0f26ba10ec8a36531bc81658f8d939c0c64d315c187e42199e3d249e72"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FilesModule-40a9d495603c13430d249b538e837f3ae2d4471bebd564133b205787b97175124332dc0f26ba10ec8a36531bc81658f8d939c0c64d315c187e42199e3d249e72"' :
                                        'id="xs-injectables-links-module-FilesModule-40a9d495603c13430d249b538e837f3ae2d4471bebd564133b205787b97175124332dc0f26ba10ec8a36531bc81658f8d939c0c64d315c187e42199e3d249e72"' }>
                                        <li class="link">
                                            <a href="injectables/FilesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FilesS3Module.html" data-type="entity-link" >FilesS3Module</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-FilesS3Module-31661d3bdec76f6cc3fe296b277956c3ac2000afc7ed96efd0ef846946c7ae1a7223166c0e6900d88080ec473b54d7f25be5184afa56972cf1ea9ffa89ef15fd"' : 'data-bs-target="#xs-controllers-links-module-FilesS3Module-31661d3bdec76f6cc3fe296b277956c3ac2000afc7ed96efd0ef846946c7ae1a7223166c0e6900d88080ec473b54d7f25be5184afa56972cf1ea9ffa89ef15fd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FilesS3Module-31661d3bdec76f6cc3fe296b277956c3ac2000afc7ed96efd0ef846946c7ae1a7223166c0e6900d88080ec473b54d7f25be5184afa56972cf1ea9ffa89ef15fd"' :
                                            'id="xs-controllers-links-module-FilesS3Module-31661d3bdec76f6cc3fe296b277956c3ac2000afc7ed96efd0ef846946c7ae1a7223166c0e6900d88080ec473b54d7f25be5184afa56972cf1ea9ffa89ef15fd"' }>
                                            <li class="link">
                                                <a href="controllers/FilesS3Controller.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilesS3Controller</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FilesS3Module-31661d3bdec76f6cc3fe296b277956c3ac2000afc7ed96efd0ef846946c7ae1a7223166c0e6900d88080ec473b54d7f25be5184afa56972cf1ea9ffa89ef15fd"' : 'data-bs-target="#xs-injectables-links-module-FilesS3Module-31661d3bdec76f6cc3fe296b277956c3ac2000afc7ed96efd0ef846946c7ae1a7223166c0e6900d88080ec473b54d7f25be5184afa56972cf1ea9ffa89ef15fd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FilesS3Module-31661d3bdec76f6cc3fe296b277956c3ac2000afc7ed96efd0ef846946c7ae1a7223166c0e6900d88080ec473b54d7f25be5184afa56972cf1ea9ffa89ef15fd"' :
                                        'id="xs-injectables-links-module-FilesS3Module-31661d3bdec76f6cc3fe296b277956c3ac2000afc7ed96efd0ef846946c7ae1a7223166c0e6900d88080ec473b54d7f25be5184afa56972cf1ea9ffa89ef15fd"' }>
                                        <li class="link">
                                            <a href="injectables/FilesS3Service.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilesS3Service</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FilesS3PresignedModule.html" data-type="entity-link" >FilesS3PresignedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-FilesS3PresignedModule-5fda092146e65f0fadece254824fbd42657a10ffb1c10d0b2fad3e96422c1c71c1118ee9724dc363d90f6f764a3bc2650c0719e7aee457c7a3f0e168888be6df"' : 'data-bs-target="#xs-controllers-links-module-FilesS3PresignedModule-5fda092146e65f0fadece254824fbd42657a10ffb1c10d0b2fad3e96422c1c71c1118ee9724dc363d90f6f764a3bc2650c0719e7aee457c7a3f0e168888be6df"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FilesS3PresignedModule-5fda092146e65f0fadece254824fbd42657a10ffb1c10d0b2fad3e96422c1c71c1118ee9724dc363d90f6f764a3bc2650c0719e7aee457c7a3f0e168888be6df"' :
                                            'id="xs-controllers-links-module-FilesS3PresignedModule-5fda092146e65f0fadece254824fbd42657a10ffb1c10d0b2fad3e96422c1c71c1118ee9724dc363d90f6f764a3bc2650c0719e7aee457c7a3f0e168888be6df"' }>
                                            <li class="link">
                                                <a href="controllers/FilesS3PresignedController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilesS3PresignedController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FilesS3PresignedModule-5fda092146e65f0fadece254824fbd42657a10ffb1c10d0b2fad3e96422c1c71c1118ee9724dc363d90f6f764a3bc2650c0719e7aee457c7a3f0e168888be6df"' : 'data-bs-target="#xs-injectables-links-module-FilesS3PresignedModule-5fda092146e65f0fadece254824fbd42657a10ffb1c10d0b2fad3e96422c1c71c1118ee9724dc363d90f6f764a3bc2650c0719e7aee457c7a3f0e168888be6df"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FilesS3PresignedModule-5fda092146e65f0fadece254824fbd42657a10ffb1c10d0b2fad3e96422c1c71c1118ee9724dc363d90f6f764a3bc2650c0719e7aee457c7a3f0e168888be6df"' :
                                        'id="xs-injectables-links-module-FilesS3PresignedModule-5fda092146e65f0fadece254824fbd42657a10ffb1c10d0b2fad3e96422c1c71c1118ee9724dc363d90f6f764a3bc2650c0719e7aee457c7a3f0e168888be6df"' }>
                                        <li class="link">
                                            <a href="injectables/FilesS3PresignedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilesS3PresignedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeModule.html" data-type="entity-link" >HomeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-HomeModule-6f13f2dce2128eadca13e8dc0f1790362a5bf5dbb61ef3ed1c67f1a1f9392e4ca3532582965cc63f227670a16137d328ecf215aa78bfcfa4f59b4d495dd8fe82"' : 'data-bs-target="#xs-controllers-links-module-HomeModule-6f13f2dce2128eadca13e8dc0f1790362a5bf5dbb61ef3ed1c67f1a1f9392e4ca3532582965cc63f227670a16137d328ecf215aa78bfcfa4f59b4d495dd8fe82"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HomeModule-6f13f2dce2128eadca13e8dc0f1790362a5bf5dbb61ef3ed1c67f1a1f9392e4ca3532582965cc63f227670a16137d328ecf215aa78bfcfa4f59b4d495dd8fe82"' :
                                            'id="xs-controllers-links-module-HomeModule-6f13f2dce2128eadca13e8dc0f1790362a5bf5dbb61ef3ed1c67f1a1f9392e4ca3532582965cc63f227670a16137d328ecf215aa78bfcfa4f59b4d495dd8fe82"' }>
                                            <li class="link">
                                                <a href="controllers/HomeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-HomeModule-6f13f2dce2128eadca13e8dc0f1790362a5bf5dbb61ef3ed1c67f1a1f9392e4ca3532582965cc63f227670a16137d328ecf215aa78bfcfa4f59b4d495dd8fe82"' : 'data-bs-target="#xs-injectables-links-module-HomeModule-6f13f2dce2128eadca13e8dc0f1790362a5bf5dbb61ef3ed1c67f1a1f9392e4ca3532582965cc63f227670a16137d328ecf215aa78bfcfa4f59b4d495dd8fe82"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HomeModule-6f13f2dce2128eadca13e8dc0f1790362a5bf5dbb61ef3ed1c67f1a1f9392e4ca3532582965cc63f227670a16137d328ecf215aa78bfcfa4f59b4d495dd8fe82"' :
                                        'id="xs-injectables-links-module-HomeModule-6f13f2dce2128eadca13e8dc0f1790362a5bf5dbb61ef3ed1c67f1a1f9392e4ca3532582965cc63f227670a16137d328ecf215aa78bfcfa4f59b4d495dd8fe82"' }>
                                        <li class="link">
                                            <a href="injectables/HomeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/KycDetailSeedModule.html" data-type="entity-link" >KycDetailSeedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-KycDetailSeedModule-c2e5d3cf8def53ac5fe0422ebb583ecdf59a2e4f7dac005fbfd7955eb7cc8d03114323557ba7c6e6238ca77b7382b422e4f2cc8ca7befbf29e83b9e932f9e3be"' : 'data-bs-target="#xs-injectables-links-module-KycDetailSeedModule-c2e5d3cf8def53ac5fe0422ebb583ecdf59a2e4f7dac005fbfd7955eb7cc8d03114323557ba7c6e6238ca77b7382b422e4f2cc8ca7befbf29e83b9e932f9e3be"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-KycDetailSeedModule-c2e5d3cf8def53ac5fe0422ebb583ecdf59a2e4f7dac005fbfd7955eb7cc8d03114323557ba7c6e6238ca77b7382b422e4f2cc8ca7befbf29e83b9e932f9e3be"' :
                                        'id="xs-injectables-links-module-KycDetailSeedModule-c2e5d3cf8def53ac5fe0422ebb583ecdf59a2e4f7dac005fbfd7955eb7cc8d03114323557ba7c6e6238ca77b7382b422e4f2cc8ca7befbf29e83b9e932f9e3be"' }>
                                        <li class="link">
                                            <a href="injectables/KycDetailSeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >KycDetailSeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/KycDetailsModule.html" data-type="entity-link" >KycDetailsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-KycDetailsModule-5036a8757444bf21d5d8c35225a1632052ed22f2209111568d774799fc00bc07be9c9f1956fa444378c9f4f39591cc71b28fff252850bab6d696e38608302552"' : 'data-bs-target="#xs-controllers-links-module-KycDetailsModule-5036a8757444bf21d5d8c35225a1632052ed22f2209111568d774799fc00bc07be9c9f1956fa444378c9f4f39591cc71b28fff252850bab6d696e38608302552"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-KycDetailsModule-5036a8757444bf21d5d8c35225a1632052ed22f2209111568d774799fc00bc07be9c9f1956fa444378c9f4f39591cc71b28fff252850bab6d696e38608302552"' :
                                            'id="xs-controllers-links-module-KycDetailsModule-5036a8757444bf21d5d8c35225a1632052ed22f2209111568d774799fc00bc07be9c9f1956fa444378c9f4f39591cc71b28fff252850bab6d696e38608302552"' }>
                                            <li class="link">
                                                <a href="controllers/KycDetailsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >KycDetailsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-KycDetailsModule-5036a8757444bf21d5d8c35225a1632052ed22f2209111568d774799fc00bc07be9c9f1956fa444378c9f4f39591cc71b28fff252850bab6d696e38608302552"' : 'data-bs-target="#xs-injectables-links-module-KycDetailsModule-5036a8757444bf21d5d8c35225a1632052ed22f2209111568d774799fc00bc07be9c9f1956fa444378c9f4f39591cc71b28fff252850bab6d696e38608302552"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-KycDetailsModule-5036a8757444bf21d5d8c35225a1632052ed22f2209111568d774799fc00bc07be9c9f1956fa444378c9f4f39591cc71b28fff252850bab6d696e38608302552"' :
                                        'id="xs-injectables-links-module-KycDetailsModule-5036a8757444bf21d5d8c35225a1632052ed22f2209111568d774799fc00bc07be9c9f1956fa444378c9f4f39591cc71b28fff252850bab6d696e38608302552"' }>
                                        <li class="link">
                                            <a href="injectables/KycDetailsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >KycDetailsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailerModule.html" data-type="entity-link" >MailerModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MailerModule-fdb40e865b70a9ffd9530973de6632d1bae1008e38875ba76b4072dff11a849884f28ebe7968a7285eee5bb97a95b692d3af63aaa0ea8a16ea79b536319b4c2a"' : 'data-bs-target="#xs-injectables-links-module-MailerModule-fdb40e865b70a9ffd9530973de6632d1bae1008e38875ba76b4072dff11a849884f28ebe7968a7285eee5bb97a95b692d3af63aaa0ea8a16ea79b536319b4c2a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailerModule-fdb40e865b70a9ffd9530973de6632d1bae1008e38875ba76b4072dff11a849884f28ebe7968a7285eee5bb97a95b692d3af63aaa0ea8a16ea79b536319b4c2a"' :
                                        'id="xs-injectables-links-module-MailerModule-fdb40e865b70a9ffd9530973de6632d1bae1008e38875ba76b4072dff11a849884f28ebe7968a7285eee5bb97a95b692d3af63aaa0ea8a16ea79b536319b4c2a"' }>
                                        <li class="link">
                                            <a href="injectables/MailerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MailModule-6530205450d87754fa4446cb3dac53f0bf511e7fbc9f5d152e657a50d20dad2ee393941b22d8146046db3d1dece5359c4e1ab62f4a5f5c7a026d227a08637ec7"' : 'data-bs-target="#xs-injectables-links-module-MailModule-6530205450d87754fa4446cb3dac53f0bf511e7fbc9f5d152e657a50d20dad2ee393941b22d8146046db3d1dece5359c4e1ab62f4a5f5c7a026d227a08637ec7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailModule-6530205450d87754fa4446cb3dac53f0bf511e7fbc9f5d152e657a50d20dad2ee393941b22d8146046db3d1dece5359c4e1ab62f4a5f5c7a026d227a08637ec7"' :
                                        'id="xs-injectables-links-module-MailModule-6530205450d87754fa4446cb3dac53f0bf511e7fbc9f5d152e657a50d20dad2ee393941b22d8146046db3d1dece5359c4e1ab62f4a5f5c7a026d227a08637ec7"' }>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegionSeedModule.html" data-type="entity-link" >RegionSeedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RegionSeedModule-7036adc7321e390e524e183ae74f340a00b4c02fa5a95db6f272a672d9e69476fc406e8f097c39b593d907a10a22faac1f4dd4ebac3b8794be11523c032c238b"' : 'data-bs-target="#xs-injectables-links-module-RegionSeedModule-7036adc7321e390e524e183ae74f340a00b4c02fa5a95db6f272a672d9e69476fc406e8f097c39b593d907a10a22faac1f4dd4ebac3b8794be11523c032c238b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RegionSeedModule-7036adc7321e390e524e183ae74f340a00b4c02fa5a95db6f272a672d9e69476fc406e8f097c39b593d907a10a22faac1f4dd4ebac3b8794be11523c032c238b"' :
                                        'id="xs-injectables-links-module-RegionSeedModule-7036adc7321e390e524e183ae74f340a00b4c02fa5a95db6f272a672d9e69476fc406e8f097c39b593d907a10a22faac1f4dd4ebac3b8794be11523c032c238b"' }>
                                        <li class="link">
                                            <a href="injectables/RegionSeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegionSeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegionsModule.html" data-type="entity-link" >RegionsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RegionsModule-1d734b655a06a6496af4f0a7e109c53fe2df7ca3a562fbcc8377d737f4d75267dd69afc68986cf9731de462443dfbf229307fcb58ce80f4b2d0036b455779369"' : 'data-bs-target="#xs-controllers-links-module-RegionsModule-1d734b655a06a6496af4f0a7e109c53fe2df7ca3a562fbcc8377d737f4d75267dd69afc68986cf9731de462443dfbf229307fcb58ce80f4b2d0036b455779369"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RegionsModule-1d734b655a06a6496af4f0a7e109c53fe2df7ca3a562fbcc8377d737f4d75267dd69afc68986cf9731de462443dfbf229307fcb58ce80f4b2d0036b455779369"' :
                                            'id="xs-controllers-links-module-RegionsModule-1d734b655a06a6496af4f0a7e109c53fe2df7ca3a562fbcc8377d737f4d75267dd69afc68986cf9731de462443dfbf229307fcb58ce80f4b2d0036b455779369"' }>
                                            <li class="link">
                                                <a href="controllers/RegionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RegionsModule-1d734b655a06a6496af4f0a7e109c53fe2df7ca3a562fbcc8377d737f4d75267dd69afc68986cf9731de462443dfbf229307fcb58ce80f4b2d0036b455779369"' : 'data-bs-target="#xs-injectables-links-module-RegionsModule-1d734b655a06a6496af4f0a7e109c53fe2df7ca3a562fbcc8377d737f4d75267dd69afc68986cf9731de462443dfbf229307fcb58ce80f4b2d0036b455779369"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RegionsModule-1d734b655a06a6496af4f0a7e109c53fe2df7ca3a562fbcc8377d737f4d75267dd69afc68986cf9731de462443dfbf229307fcb58ce80f4b2d0036b455779369"' :
                                        'id="xs-injectables-links-module-RegionsModule-1d734b655a06a6496af4f0a7e109c53fe2df7ca3a562fbcc8377d737f4d75267dd69afc68986cf9731de462443dfbf229307fcb58ce80f4b2d0036b455779369"' }>
                                        <li class="link">
                                            <a href="injectables/RegionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegionsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RelationalAccountPersistenceModule.html" data-type="entity-link" >RelationalAccountPersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RelationalFilePersistenceModule.html" data-type="entity-link" >RelationalFilePersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RelationalKycDetailsPersistenceModule.html" data-type="entity-link" >RelationalKycDetailsPersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RelationalRegionPersistenceModule.html" data-type="entity-link" >RelationalRegionPersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RelationalResidencePersistenceModule.html" data-type="entity-link" >RelationalResidencePersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RelationalSessionPersistenceModule.html" data-type="entity-link" >RelationalSessionPersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RelationalSettingsPersistenceModule.html" data-type="entity-link" >RelationalSettingsPersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RelationalTenantPersistenceModule.html" data-type="entity-link" >RelationalTenantPersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RelationalTenantTypePersistenceModule.html" data-type="entity-link" >RelationalTenantTypePersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RelationalUserPersistenceModule.html" data-type="entity-link" >RelationalUserPersistenceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ResidenceSeedModule.html" data-type="entity-link" >ResidenceSeedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ResidenceSeedModule-592922ce4c920a3a112a16cc9a750279a48b92fb7249a4ee8b023fca9a6589b6ff22531c25dd273e1138d7fe8aae6f1eabf44405fab728c06d4429f9aa495549"' : 'data-bs-target="#xs-injectables-links-module-ResidenceSeedModule-592922ce4c920a3a112a16cc9a750279a48b92fb7249a4ee8b023fca9a6589b6ff22531c25dd273e1138d7fe8aae6f1eabf44405fab728c06d4429f9aa495549"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResidenceSeedModule-592922ce4c920a3a112a16cc9a750279a48b92fb7249a4ee8b023fca9a6589b6ff22531c25dd273e1138d7fe8aae6f1eabf44405fab728c06d4429f9aa495549"' :
                                        'id="xs-injectables-links-module-ResidenceSeedModule-592922ce4c920a3a112a16cc9a750279a48b92fb7249a4ee8b023fca9a6589b6ff22531c25dd273e1138d7fe8aae6f1eabf44405fab728c06d4429f9aa495549"' }>
                                        <li class="link">
                                            <a href="injectables/ResidenceSeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResidenceSeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResidencesModule.html" data-type="entity-link" >ResidencesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ResidencesModule-4e1f12faafb0c4184f47de0762bde5f7de4c5c9a4cc2e8367ca24cdf0e889b18340b4047716dd6372631ab8fdaf92364cbf3656fc594c806a7522e3c3da83cde"' : 'data-bs-target="#xs-controllers-links-module-ResidencesModule-4e1f12faafb0c4184f47de0762bde5f7de4c5c9a4cc2e8367ca24cdf0e889b18340b4047716dd6372631ab8fdaf92364cbf3656fc594c806a7522e3c3da83cde"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ResidencesModule-4e1f12faafb0c4184f47de0762bde5f7de4c5c9a4cc2e8367ca24cdf0e889b18340b4047716dd6372631ab8fdaf92364cbf3656fc594c806a7522e3c3da83cde"' :
                                            'id="xs-controllers-links-module-ResidencesModule-4e1f12faafb0c4184f47de0762bde5f7de4c5c9a4cc2e8367ca24cdf0e889b18340b4047716dd6372631ab8fdaf92364cbf3656fc594c806a7522e3c3da83cde"' }>
                                            <li class="link">
                                                <a href="controllers/ResidencesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResidencesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ResidencesModule-4e1f12faafb0c4184f47de0762bde5f7de4c5c9a4cc2e8367ca24cdf0e889b18340b4047716dd6372631ab8fdaf92364cbf3656fc594c806a7522e3c3da83cde"' : 'data-bs-target="#xs-injectables-links-module-ResidencesModule-4e1f12faafb0c4184f47de0762bde5f7de4c5c9a4cc2e8367ca24cdf0e889b18340b4047716dd6372631ab8fdaf92364cbf3656fc594c806a7522e3c3da83cde"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResidencesModule-4e1f12faafb0c4184f47de0762bde5f7de4c5c9a4cc2e8367ca24cdf0e889b18340b4047716dd6372631ab8fdaf92364cbf3656fc594c806a7522e3c3da83cde"' :
                                        'id="xs-injectables-links-module-ResidencesModule-4e1f12faafb0c4184f47de0762bde5f7de4c5c9a4cc2e8367ca24cdf0e889b18340b4047716dd6372631ab8fdaf92364cbf3656fc594c806a7522e3c3da83cde"' }>
                                        <li class="link">
                                            <a href="injectables/ResidencesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResidencesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RoleSeedModule.html" data-type="entity-link" >RoleSeedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RoleSeedModule-cd4f3033a7a97c7b196cf9b58f0502462b106e7155c313250550739795cf8474e98a2c0540d45cf0de3d319784dd1875ec613247e640736cdc9c89fdac604f2f"' : 'data-bs-target="#xs-injectables-links-module-RoleSeedModule-cd4f3033a7a97c7b196cf9b58f0502462b106e7155c313250550739795cf8474e98a2c0540d45cf0de3d319784dd1875ec613247e640736cdc9c89fdac604f2f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RoleSeedModule-cd4f3033a7a97c7b196cf9b58f0502462b106e7155c313250550739795cf8474e98a2c0540d45cf0de3d319784dd1875ec613247e640736cdc9c89fdac604f2f"' :
                                        'id="xs-injectables-links-module-RoleSeedModule-cd4f3033a7a97c7b196cf9b58f0502462b106e7155c313250550739795cf8474e98a2c0540d45cf0de3d319784dd1875ec613247e640736cdc9c89fdac604f2f"' }>
                                        <li class="link">
                                            <a href="injectables/RoleSeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleSeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SeedModule.html" data-type="entity-link" >SeedModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SeedModule.html" data-type="entity-link" >SeedModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SessionModule.html" data-type="entity-link" >SessionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SessionModule-af9b8572ffc9e4e706dcbdbfa04afac9e54dc447eae038b8e10117e649aaa048a9d61468be703a298dfdb0003a464e765bf68883e68deb33199cc6c2ceebd4e3"' : 'data-bs-target="#xs-injectables-links-module-SessionModule-af9b8572ffc9e4e706dcbdbfa04afac9e54dc447eae038b8e10117e649aaa048a9d61468be703a298dfdb0003a464e765bf68883e68deb33199cc6c2ceebd4e3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SessionModule-af9b8572ffc9e4e706dcbdbfa04afac9e54dc447eae038b8e10117e649aaa048a9d61468be703a298dfdb0003a464e765bf68883e68deb33199cc6c2ceebd4e3"' :
                                        'id="xs-injectables-links-module-SessionModule-af9b8572ffc9e4e706dcbdbfa04afac9e54dc447eae038b8e10117e649aaa048a9d61468be703a298dfdb0003a464e765bf68883e68deb33199cc6c2ceebd4e3"' }>
                                        <li class="link">
                                            <a href="injectables/SessionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingsModule.html" data-type="entity-link" >SettingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-SettingsModule-ef7a2215d7ae09fb6a49abd3cdd90d848b1e560e9826d73380f6434aa4dd7803d6c503b00fa2d146deca460449c3bb234028467249ac2f7647f2aaf3a80be2b6"' : 'data-bs-target="#xs-controllers-links-module-SettingsModule-ef7a2215d7ae09fb6a49abd3cdd90d848b1e560e9826d73380f6434aa4dd7803d6c503b00fa2d146deca460449c3bb234028467249ac2f7647f2aaf3a80be2b6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SettingsModule-ef7a2215d7ae09fb6a49abd3cdd90d848b1e560e9826d73380f6434aa4dd7803d6c503b00fa2d146deca460449c3bb234028467249ac2f7647f2aaf3a80be2b6"' :
                                            'id="xs-controllers-links-module-SettingsModule-ef7a2215d7ae09fb6a49abd3cdd90d848b1e560e9826d73380f6434aa4dd7803d6c503b00fa2d146deca460449c3bb234028467249ac2f7647f2aaf3a80be2b6"' }>
                                            <li class="link">
                                                <a href="controllers/SettingsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SettingsModule-ef7a2215d7ae09fb6a49abd3cdd90d848b1e560e9826d73380f6434aa4dd7803d6c503b00fa2d146deca460449c3bb234028467249ac2f7647f2aaf3a80be2b6"' : 'data-bs-target="#xs-injectables-links-module-SettingsModule-ef7a2215d7ae09fb6a49abd3cdd90d848b1e560e9826d73380f6434aa4dd7803d6c503b00fa2d146deca460449c3bb234028467249ac2f7647f2aaf3a80be2b6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SettingsModule-ef7a2215d7ae09fb6a49abd3cdd90d848b1e560e9826d73380f6434aa4dd7803d6c503b00fa2d146deca460449c3bb234028467249ac2f7647f2aaf3a80be2b6"' :
                                        'id="xs-injectables-links-module-SettingsModule-ef7a2215d7ae09fb6a49abd3cdd90d848b1e560e9826d73380f6434aa4dd7803d6c503b00fa2d146deca460449c3bb234028467249ac2f7647f2aaf3a80be2b6"' }>
                                        <li class="link">
                                            <a href="injectables/SettingsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingsSeedModule.html" data-type="entity-link" >SettingsSeedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SettingsSeedModule-e09b58a0dfa02497e36957333b7750657170faa848210ef75f24ac5ce3d890bbc1473a6cd437ffde4b288634b58be68f846ee74c385627cfcfdbca9ea57a725b"' : 'data-bs-target="#xs-injectables-links-module-SettingsSeedModule-e09b58a0dfa02497e36957333b7750657170faa848210ef75f24ac5ce3d890bbc1473a6cd437ffde4b288634b58be68f846ee74c385627cfcfdbca9ea57a725b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SettingsSeedModule-e09b58a0dfa02497e36957333b7750657170faa848210ef75f24ac5ce3d890bbc1473a6cd437ffde4b288634b58be68f846ee74c385627cfcfdbca9ea57a725b"' :
                                        'id="xs-injectables-links-module-SettingsSeedModule-e09b58a0dfa02497e36957333b7750657170faa848210ef75f24ac5ce3d890bbc1473a6cd437ffde4b288634b58be68f846ee74c385627cfcfdbca9ea57a725b"' }>
                                        <li class="link">
                                            <a href="injectables/SettingsSeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsSeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StatusSeedModule.html" data-type="entity-link" >StatusSeedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-StatusSeedModule-bb9764e9704311c785849f21e9dbe699e0e9a609a23ad90ccc4540af3a0dd7ecaf7c37fd2c169db3c71676b04141b87e4c5038df0327762d17264acecc96991f"' : 'data-bs-target="#xs-injectables-links-module-StatusSeedModule-bb9764e9704311c785849f21e9dbe699e0e9a609a23ad90ccc4540af3a0dd7ecaf7c37fd2c169db3c71676b04141b87e4c5038df0327762d17264acecc96991f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StatusSeedModule-bb9764e9704311c785849f21e9dbe699e0e9a609a23ad90ccc4540af3a0dd7ecaf7c37fd2c169db3c71676b04141b87e4c5038df0327762d17264acecc96991f"' :
                                        'id="xs-injectables-links-module-StatusSeedModule-bb9764e9704311c785849f21e9dbe699e0e9a609a23ad90ccc4540af3a0dd7ecaf7c37fd2c169db3c71676b04141b87e4c5038df0327762d17264acecc96991f"' }>
                                        <li class="link">
                                            <a href="injectables/StatusSeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatusSeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TenantSeedModule.html" data-type="entity-link" >TenantSeedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TenantSeedModule-951b35eb8c3f1c67428552f1e051487b5625b9bc6f0458bbf6992f0ae04d5316bb3082ffd58b84b523a3c26bb589957aab022734413c25ab50673b52491d4078"' : 'data-bs-target="#xs-injectables-links-module-TenantSeedModule-951b35eb8c3f1c67428552f1e051487b5625b9bc6f0458bbf6992f0ae04d5316bb3082ffd58b84b523a3c26bb589957aab022734413c25ab50673b52491d4078"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TenantSeedModule-951b35eb8c3f1c67428552f1e051487b5625b9bc6f0458bbf6992f0ae04d5316bb3082ffd58b84b523a3c26bb589957aab022734413c25ab50673b52491d4078"' :
                                        'id="xs-injectables-links-module-TenantSeedModule-951b35eb8c3f1c67428552f1e051487b5625b9bc6f0458bbf6992f0ae04d5316bb3082ffd58b84b523a3c26bb589957aab022734413c25ab50673b52491d4078"' }>
                                        <li class="link">
                                            <a href="injectables/TenantSeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TenantSeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TenantsModule.html" data-type="entity-link" >TenantsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TenantsModule-57ba8e0e1799b4aa99dc3fe3ab869a4339f1e901474beac08a96e8f43066a511be1fb5100c8432bf44c330d93e46ac9a62c0bba8aac420a8c75921dce61eb2fd"' : 'data-bs-target="#xs-controllers-links-module-TenantsModule-57ba8e0e1799b4aa99dc3fe3ab869a4339f1e901474beac08a96e8f43066a511be1fb5100c8432bf44c330d93e46ac9a62c0bba8aac420a8c75921dce61eb2fd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TenantsModule-57ba8e0e1799b4aa99dc3fe3ab869a4339f1e901474beac08a96e8f43066a511be1fb5100c8432bf44c330d93e46ac9a62c0bba8aac420a8c75921dce61eb2fd"' :
                                            'id="xs-controllers-links-module-TenantsModule-57ba8e0e1799b4aa99dc3fe3ab869a4339f1e901474beac08a96e8f43066a511be1fb5100c8432bf44c330d93e46ac9a62c0bba8aac420a8c75921dce61eb2fd"' }>
                                            <li class="link">
                                                <a href="controllers/TenantsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TenantsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TenantsModule-57ba8e0e1799b4aa99dc3fe3ab869a4339f1e901474beac08a96e8f43066a511be1fb5100c8432bf44c330d93e46ac9a62c0bba8aac420a8c75921dce61eb2fd"' : 'data-bs-target="#xs-injectables-links-module-TenantsModule-57ba8e0e1799b4aa99dc3fe3ab869a4339f1e901474beac08a96e8f43066a511be1fb5100c8432bf44c330d93e46ac9a62c0bba8aac420a8c75921dce61eb2fd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TenantsModule-57ba8e0e1799b4aa99dc3fe3ab869a4339f1e901474beac08a96e8f43066a511be1fb5100c8432bf44c330d93e46ac9a62c0bba8aac420a8c75921dce61eb2fd"' :
                                        'id="xs-injectables-links-module-TenantsModule-57ba8e0e1799b4aa99dc3fe3ab869a4339f1e901474beac08a96e8f43066a511be1fb5100c8432bf44c330d93e46ac9a62c0bba8aac420a8c75921dce61eb2fd"' }>
                                        <li class="link">
                                            <a href="injectables/TenantsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TenantsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TenantTypesModule.html" data-type="entity-link" >TenantTypesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TenantTypesModule-4a65c2e7114c651c5a6dff2a048c14d67519212014a81cfa4e0ca907e99e7755d9330499955014de757a8d974b9405510210f7569a866ca78b5d2db8d3be6619"' : 'data-bs-target="#xs-controllers-links-module-TenantTypesModule-4a65c2e7114c651c5a6dff2a048c14d67519212014a81cfa4e0ca907e99e7755d9330499955014de757a8d974b9405510210f7569a866ca78b5d2db8d3be6619"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TenantTypesModule-4a65c2e7114c651c5a6dff2a048c14d67519212014a81cfa4e0ca907e99e7755d9330499955014de757a8d974b9405510210f7569a866ca78b5d2db8d3be6619"' :
                                            'id="xs-controllers-links-module-TenantTypesModule-4a65c2e7114c651c5a6dff2a048c14d67519212014a81cfa4e0ca907e99e7755d9330499955014de757a8d974b9405510210f7569a866ca78b5d2db8d3be6619"' }>
                                            <li class="link">
                                                <a href="controllers/TenantTypesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TenantTypesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TenantTypesModule-4a65c2e7114c651c5a6dff2a048c14d67519212014a81cfa4e0ca907e99e7755d9330499955014de757a8d974b9405510210f7569a866ca78b5d2db8d3be6619"' : 'data-bs-target="#xs-injectables-links-module-TenantTypesModule-4a65c2e7114c651c5a6dff2a048c14d67519212014a81cfa4e0ca907e99e7755d9330499955014de757a8d974b9405510210f7569a866ca78b5d2db8d3be6619"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TenantTypesModule-4a65c2e7114c651c5a6dff2a048c14d67519212014a81cfa4e0ca907e99e7755d9330499955014de757a8d974b9405510210f7569a866ca78b5d2db8d3be6619"' :
                                        'id="xs-injectables-links-module-TenantTypesModule-4a65c2e7114c651c5a6dff2a048c14d67519212014a81cfa4e0ca907e99e7755d9330499955014de757a8d974b9405510210f7569a866ca78b5d2db8d3be6619"' }>
                                        <li class="link">
                                            <a href="injectables/TenantTypesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TenantTypesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TenantTypesSeedModule.html" data-type="entity-link" >TenantTypesSeedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TenantTypesSeedModule-944b18615a10ac91c6b9c7430ae0fb826db10abb2873e2c06a8f11a132bce41fe0548432febe5cde30c392b587a7b7e5c2c3ff9ad3ac0eb34ae3f7fa2bde7070"' : 'data-bs-target="#xs-injectables-links-module-TenantTypesSeedModule-944b18615a10ac91c6b9c7430ae0fb826db10abb2873e2c06a8f11a132bce41fe0548432febe5cde30c392b587a7b7e5c2c3ff9ad3ac0eb34ae3f7fa2bde7070"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TenantTypesSeedModule-944b18615a10ac91c6b9c7430ae0fb826db10abb2873e2c06a8f11a132bce41fe0548432febe5cde30c392b587a7b7e5c2c3ff9ad3ac0eb34ae3f7fa2bde7070"' :
                                        'id="xs-injectables-links-module-TenantTypesSeedModule-944b18615a10ac91c6b9c7430ae0fb826db10abb2873e2c06a8f11a132bce41fe0548432febe5cde30c392b587a7b7e5c2c3ff9ad3ac0eb34ae3f7fa2bde7070"' }>
                                        <li class="link">
                                            <a href="injectables/TenantTypesSeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TenantTypesSeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserSeedModule.html" data-type="entity-link" >UserSeedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserSeedModule-30acd91c1d71f61252fa2c0d7c5500701d74616e624321c03fa8e74802cd3812102f108a4906a4a8eda3bd3ea01bbf9e29df611c0112390afa38e3a4c63494c7"' : 'data-bs-target="#xs-injectables-links-module-UserSeedModule-30acd91c1d71f61252fa2c0d7c5500701d74616e624321c03fa8e74802cd3812102f108a4906a4a8eda3bd3ea01bbf9e29df611c0112390afa38e3a4c63494c7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserSeedModule-30acd91c1d71f61252fa2c0d7c5500701d74616e624321c03fa8e74802cd3812102f108a4906a4a8eda3bd3ea01bbf9e29df611c0112390afa38e3a4c63494c7"' :
                                        'id="xs-injectables-links-module-UserSeedModule-30acd91c1d71f61252fa2c0d7c5500701d74616e624321c03fa8e74802cd3812102f108a4906a4a8eda3bd3ea01bbf9e29df611c0112390afa38e3a4c63494c7"' }>
                                        <li class="link">
                                            <a href="injectables/UserSeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserSeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserSeedModule.html" data-type="entity-link" >UserSeedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserSeedModule-9d6df7a212c9da14bee62f160679415ea19b58253d58b49487d303a285ce3ce8504934b8386cd3a00294ba696725f21801a2073cda0aeb0cbc86a287f7166792-1"' : 'data-bs-target="#xs-injectables-links-module-UserSeedModule-9d6df7a212c9da14bee62f160679415ea19b58253d58b49487d303a285ce3ce8504934b8386cd3a00294ba696725f21801a2073cda0aeb0cbc86a287f7166792-1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserSeedModule-9d6df7a212c9da14bee62f160679415ea19b58253d58b49487d303a285ce3ce8504934b8386cd3a00294ba696725f21801a2073cda0aeb0cbc86a287f7166792-1"' :
                                        'id="xs-injectables-links-module-UserSeedModule-9d6df7a212c9da14bee62f160679415ea19b58253d58b49487d303a285ce3ce8504934b8386cd3a00294ba696725f21801a2073cda0aeb0cbc86a287f7166792-1"' }>
                                        <li class="link">
                                            <a href="injectables/UserSeedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserSeedService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-760b0b94c39e5399a251b66d9f7f2decdb6471fd6cbf11a783182afe95bb8860348e5f5798ba280a1e710ef4fb9ef13d47681ab0a8aa9e67cb6ceb68d558298f"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-760b0b94c39e5399a251b66d9f7f2decdb6471fd6cbf11a783182afe95bb8860348e5f5798ba280a1e710ef4fb9ef13d47681ab0a8aa9e67cb6ceb68d558298f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-760b0b94c39e5399a251b66d9f7f2decdb6471fd6cbf11a783182afe95bb8860348e5f5798ba280a1e710ef4fb9ef13d47681ab0a8aa9e67cb6ceb68d558298f"' :
                                            'id="xs-controllers-links-module-UsersModule-760b0b94c39e5399a251b66d9f7f2decdb6471fd6cbf11a783182afe95bb8860348e5f5798ba280a1e710ef4fb9ef13d47681ab0a8aa9e67cb6ceb68d558298f"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-760b0b94c39e5399a251b66d9f7f2decdb6471fd6cbf11a783182afe95bb8860348e5f5798ba280a1e710ef4fb9ef13d47681ab0a8aa9e67cb6ceb68d558298f"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-760b0b94c39e5399a251b66d9f7f2decdb6471fd6cbf11a783182afe95bb8860348e5f5798ba280a1e710ef4fb9ef13d47681ab0a8aa9e67cb6ceb68d558298f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-760b0b94c39e5399a251b66d9f7f2decdb6471fd6cbf11a783182afe95bb8860348e5f5798ba280a1e710ef4fb9ef13d47681ab0a8aa9e67cb6ceb68d558298f"' :
                                        'id="xs-injectables-links-module-UsersModule-760b0b94c39e5399a251b66d9f7f2decdb6471fd6cbf11a783182afe95bb8860348e5f5798ba280a1e710ef4fb9ef13d47681ab0a8aa9e67cb6ceb68d558298f"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AccountsController.html" data-type="entity-link" >AccountsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthAppleController.html" data-type="entity-link" >AuthAppleController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthFacebookController.html" data-type="entity-link" >AuthFacebookController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthGoogleController.html" data-type="entity-link" >AuthGoogleController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/FilesLocalController.html" data-type="entity-link" >FilesLocalController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/FilesS3Controller.html" data-type="entity-link" >FilesS3Controller</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/FilesS3PresignedController.html" data-type="entity-link" >FilesS3PresignedController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/HomeController.html" data-type="entity-link" >HomeController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/KycDetailsController.html" data-type="entity-link" >KycDetailsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RegionsController.html" data-type="entity-link" >RegionsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ResidencesController.html" data-type="entity-link" >ResidencesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SettingsController.html" data-type="entity-link" >SettingsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TenantsController.html" data-type="entity-link" >TenantsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TenantTypesController.html" data-type="entity-link" >TenantTypesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/AccountEntity.html" data-type="entity-link" >AccountEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/FileEntity.html" data-type="entity-link" >FileEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/KycDetailsEntity.html" data-type="entity-link" >KycDetailsEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RegionEntity.html" data-type="entity-link" >RegionEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ResidenceEntity.html" data-type="entity-link" >ResidenceEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RoleEntity.html" data-type="entity-link" >RoleEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SessionEntity.html" data-type="entity-link" >SessionEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SettingsEntity.html" data-type="entity-link" >SettingsEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/StatusEntity.html" data-type="entity-link" >StatusEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TenantEntity.html" data-type="entity-link" >TenantEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TenantTypeEntity.html" data-type="entity-link" >TenantTypeEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserEntity.html" data-type="entity-link" >UserEntity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Account.html" data-type="entity-link" >Account</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountDto.html" data-type="entity-link" >AccountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountMapper.html" data-type="entity-link" >AccountMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountRepository.html" data-type="entity-link" >AccountRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddKycDetails1745134929693.html" data-type="entity-link" >AddKycDetails1745134929693</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddKycDetailsFields1745138722127.html" data-type="entity-link" >AddKycDetailsFields1745138722127</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddRegions1745152940566.html" data-type="entity-link" >AddRegions1745152940566</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddSettingsTableAndFileds1745147786203.html" data-type="entity-link" >AddSettingsTableAndFileds1745147786203</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddTenantFieldsAndTenantTypeTable1745143148021.html" data-type="entity-link" >AddTenantFieldsAndTenantTypeTable1745143148021</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthAppleLoginDto.html" data-type="entity-link" >AuthAppleLoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthConfirmEmailDto.html" data-type="entity-link" >AuthConfirmEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthEmailLoginDto.html" data-type="entity-link" >AuthEmailLoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthFacebookLoginDto.html" data-type="entity-link" >AuthFacebookLoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthForgotPasswordDto.html" data-type="entity-link" >AuthForgotPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthGoogleLoginDto.html" data-type="entity-link" >AuthGoogleLoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthRegisterLoginDto.html" data-type="entity-link" >AuthRegisterLoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResetPasswordDto.html" data-type="entity-link" >AuthResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthUpdateDto.html" data-type="entity-link" >AuthUpdateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAccountDto.html" data-type="entity-link" >CreateAccountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAccountsTable1747393574185.html" data-type="entity-link" >CreateAccountsTable1747393574185</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateKycDetailsDto.html" data-type="entity-link" >CreateKycDetailsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRegionDto.html" data-type="entity-link" >CreateRegionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateResidence1747295167463.html" data-type="entity-link" >CreateResidence1747295167463</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateResidenceDto.html" data-type="entity-link" >CreateResidenceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSettingsDto.html" data-type="entity-link" >CreateSettingsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTenantDto.html" data-type="entity-link" >CreateTenantDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTenantTable1745086820741.html" data-type="entity-link" >CreateTenantTable1745086820741</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTenantTypeDto.html" data-type="entity-link" >CreateTenantTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUser1715028537217.html" data-type="entity-link" >CreateUser1715028537217</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserTenantRelationship1745132189825.html" data-type="entity-link" >CreateUserTenantRelationship1745132189825</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityDocumentHelper.html" data-type="entity-link" >EntityDocumentHelper</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityRelationalHelper.html" data-type="entity-link" >EntityRelationalHelper</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnvironmentVariablesValidator.html" data-type="entity-link" >EnvironmentVariablesValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnvironmentVariablesValidator-1.html" data-type="entity-link" >EnvironmentVariablesValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnvironmentVariablesValidator-2.html" data-type="entity-link" >EnvironmentVariablesValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnvironmentVariablesValidator-3.html" data-type="entity-link" >EnvironmentVariablesValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnvironmentVariablesValidator-4.html" data-type="entity-link" >EnvironmentVariablesValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnvironmentVariablesValidator-5.html" data-type="entity-link" >EnvironmentVariablesValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnvironmentVariablesValidator-6.html" data-type="entity-link" >EnvironmentVariablesValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnvironmentVariablesValidator-7.html" data-type="entity-link" >EnvironmentVariablesValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileDto.html" data-type="entity-link" >FileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileMapper.html" data-type="entity-link" >FileMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileMapper-1.html" data-type="entity-link" >FileMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileRepository.html" data-type="entity-link" >FileRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileResponseDto.html" data-type="entity-link" >FileResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileResponseDto-1.html" data-type="entity-link" >FileResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileResponseDto-2.html" data-type="entity-link" >FileResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileSchemaClass.html" data-type="entity-link" >FileSchemaClass</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileType.html" data-type="entity-link" >FileType</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileUploadDto.html" data-type="entity-link" >FileUploadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterUserDto.html" data-type="entity-link" >FilterUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindAllAccountsDto.html" data-type="entity-link" >FindAllAccountsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindAllKycDetailsDto.html" data-type="entity-link" >FindAllKycDetailsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindAllRegionsDto.html" data-type="entity-link" >FindAllRegionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindAllResidencesDto.html" data-type="entity-link" >FindAllResidencesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindAllSettingsDto.html" data-type="entity-link" >FindAllSettingsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindAllTenantsDto.html" data-type="entity-link" >FindAllTenantsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindAllTenantTypesDto.html" data-type="entity-link" >FindAllTenantTypesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InfinityPaginationResponseDto.html" data-type="entity-link" >InfinityPaginationResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/KycDetails.html" data-type="entity-link" >KycDetails</a>
                            </li>
                            <li class="link">
                                <a href="classes/KycDetailsDto.html" data-type="entity-link" >KycDetailsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/KycDetailsMapper.html" data-type="entity-link" >KycDetailsMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/KycDetailsMapper-1.html" data-type="entity-link" >KycDetailsMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/KycDetailsRepository.html" data-type="entity-link" >KycDetailsRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/KycDetailsSchemaClass.html" data-type="entity-link" >KycDetailsSchemaClass</a>
                            </li>
                            <li class="link">
                                <a href="classes/LatestChanges1745163536016.html" data-type="entity-link" >LatestChanges1745163536016</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginResponseDto.html" data-type="entity-link" >LoginResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryUserDto.html" data-type="entity-link" >QueryUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshResponseDto.html" data-type="entity-link" >RefreshResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Region.html" data-type="entity-link" >Region</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegionDto.html" data-type="entity-link" >RegionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegionMapper.html" data-type="entity-link" >RegionMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegionRepository.html" data-type="entity-link" >RegionRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/Residence.html" data-type="entity-link" >Residence</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidenceDto.html" data-type="entity-link" >ResidenceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidenceMapper.html" data-type="entity-link" >ResidenceMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidenceRepository.html" data-type="entity-link" >ResidenceRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/Role.html" data-type="entity-link" >Role</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleDto.html" data-type="entity-link" >RoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleSchema.html" data-type="entity-link" >RoleSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/Session.html" data-type="entity-link" >Session</a>
                            </li>
                            <li class="link">
                                <a href="classes/SessionMapper.html" data-type="entity-link" >SessionMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/SessionMapper-1.html" data-type="entity-link" >SessionMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/SessionRepository.html" data-type="entity-link" >SessionRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/SessionSchemaClass.html" data-type="entity-link" >SessionSchemaClass</a>
                            </li>
                            <li class="link">
                                <a href="classes/Settings.html" data-type="entity-link" >Settings</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsDto.html" data-type="entity-link" >SettingsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsMapper.html" data-type="entity-link" >SettingsMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsRepository.html" data-type="entity-link" >SettingsRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/SortUserDto.html" data-type="entity-link" >SortUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Status.html" data-type="entity-link" >Status</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatusDto.html" data-type="entity-link" >StatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatusSchema.html" data-type="entity-link" >StatusSchema</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tenant.html" data-type="entity-link" >Tenant</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantDto.html" data-type="entity-link" >TenantDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantMapper.html" data-type="entity-link" >TenantMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantRepository.html" data-type="entity-link" >TenantRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantType.html" data-type="entity-link" >TenantType</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantTypeDto.html" data-type="entity-link" >TenantTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantTypeMapper.html" data-type="entity-link" >TenantTypeMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantTypeRepository.html" data-type="entity-link" >TenantTypeRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tokens.html" data-type="entity-link" >Tokens</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAccountDto.html" data-type="entity-link" >UpdateAccountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateKycDetailsDto.html" data-type="entity-link" >UpdateKycDetailsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRegionDto.html" data-type="entity-link" >UpdateRegionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateResidenceDto.html" data-type="entity-link" >UpdateResidenceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSettingsDto.html" data-type="entity-link" >UpdateSettingsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTenantDto.html" data-type="entity-link" >UpdateTenantDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTenantTypeDto.html" data-type="entity-link" >UpdateTenantTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDto.html" data-type="entity-link" >UserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserMapper.html" data-type="entity-link" >UserMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserMapper-1.html" data-type="entity-link" >UserMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRepository.html" data-type="entity-link" >UserRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserSchemaClass.html" data-type="entity-link" >UserSchemaClass</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AccountRelationalRepository.html" data-type="entity-link" >AccountRelationalRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountSeedService.html" data-type="entity-link" >AccountSeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountsService.html" data-type="entity-link" >AccountsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AnonymousStrategy.html" data-type="entity-link" >AnonymousStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthAppleService.html" data-type="entity-link" >AuthAppleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthFacebookService.html" data-type="entity-link" >AuthFacebookService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthGoogleService.html" data-type="entity-link" >AuthGoogleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileDocumentRepository.html" data-type="entity-link" >FileDocumentRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileRelationalRepository.html" data-type="entity-link" >FileRelationalRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FilesLocalService.html" data-type="entity-link" >FilesLocalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FilesS3PresignedService.html" data-type="entity-link" >FilesS3PresignedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FilesS3Service.html" data-type="entity-link" >FilesS3Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FilesService.html" data-type="entity-link" >FilesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HomeService.html" data-type="entity-link" >HomeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshStrategy.html" data-type="entity-link" >JwtRefreshStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KycDetailsDocumentRepository.html" data-type="entity-link" >KycDetailsDocumentRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KycDetailSeedService.html" data-type="entity-link" >KycDetailSeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KycDetailsRelationalRepository.html" data-type="entity-link" >KycDetailsRelationalRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KycDetailsService.html" data-type="entity-link" >KycDetailsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailerService.html" data-type="entity-link" >MailerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailService.html" data-type="entity-link" >MailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MongooseConfigService.html" data-type="entity-link" >MongooseConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RegionRelationalRepository.html" data-type="entity-link" >RegionRelationalRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RegionSeedService.html" data-type="entity-link" >RegionSeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RegionsService.html" data-type="entity-link" >RegionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResidenceRelationalRepository.html" data-type="entity-link" >ResidenceRelationalRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResidenceSeedService.html" data-type="entity-link" >ResidenceSeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResidencesService.html" data-type="entity-link" >ResidencesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResolvePromisesInterceptor.html" data-type="entity-link" >ResolvePromisesInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleSeedService.html" data-type="entity-link" >RoleSeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SessionDocumentRepository.html" data-type="entity-link" >SessionDocumentRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SessionRelationalRepository.html" data-type="entity-link" >SessionRelationalRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SessionService.html" data-type="entity-link" >SessionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingsRelationalRepository.html" data-type="entity-link" >SettingsRelationalRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingsSeedService.html" data-type="entity-link" >SettingsSeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingsService.html" data-type="entity-link" >SettingsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StatusSeedService.html" data-type="entity-link" >StatusSeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantRelationalRepository.html" data-type="entity-link" >TenantRelationalRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantSeedService.html" data-type="entity-link" >TenantSeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantsService.html" data-type="entity-link" >TenantsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantTypeRelationalRepository.html" data-type="entity-link" >TenantTypeRelationalRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantTypesSeedService.html" data-type="entity-link" >TenantTypesSeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantTypesService.html" data-type="entity-link" >TenantTypesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TypeOrmConfigService.html" data-type="entity-link" >TypeOrmConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersDocumentRepository.html" data-type="entity-link" >UsersDocumentRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserSeedService.html" data-type="entity-link" >UserSeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserSeedService-1.html" data-type="entity-link" >UserSeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersRelationalRepository.html" data-type="entity-link" >UsersRelationalRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/FacebookInterface.html" data-type="entity-link" >FacebookInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPaginationOptions.html" data-type="entity-link" >IPaginationOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MailData.html" data-type="entity-link" >MailData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingsConfig.html" data-type="entity-link" >SettingsConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SocialInterface.html" data-type="entity-link" >SocialInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});