#import "AppDelegate.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  
  // 创建一个简单的视图控制器
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view.backgroundColor = [UIColor whiteColor];
  
  // 添加一个标签显示应用信息
  UILabel *label = [[UILabel alloc] init];
  label.text = @"漂流瓶应用\nReact Native 功能正在加载中...";
  label.textAlignment = NSTextAlignmentCenter;
  label.numberOfLines = 0;
  label.font = [UIFont systemFontOfSize:18];
  label.translatesAutoresizingMaskIntoConstraints = NO;
  [rootViewController.view addSubview:label];
  
  // 设置约束
  [NSLayoutConstraint activateConstraints:@[
    [label.centerXAnchor constraintEqualToAnchor:rootViewController.view.centerXAnchor],
    [label.centerYAnchor constraintEqualToAnchor:rootViewController.view.centerYAnchor],
    [label.leadingAnchor constraintGreaterThanOrEqualToAnchor:rootViewController.view.leadingAnchor constant:20],
    [label.trailingAnchor constraintLessThanOrEqualToAnchor:rootViewController.view.trailingAnchor constant:-20]
  ]];
  
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  return YES;
}

@end
