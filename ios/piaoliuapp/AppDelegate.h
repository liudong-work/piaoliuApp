#import <float.h>
#import <math.h>
#import <limits.h>

// 确保 FLT_MAX 和 FLT_MIN 被定义
#ifndef FLT_MAX
#define FLT_MAX __FLT_MAX__
#endif
#ifndef FLT_MIN
#define FLT_MIN __FLT_MIN__
#endif

#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
